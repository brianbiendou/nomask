"""Module Telegram — notifications asynchrones pour NoMask.

Envoie des messages formatés au bot Telegram configuré.
Toutes les fonctions sont fire-and-forget (jamais bloquantes).

Variables d'env requises :
  TELEGRAM_BOT_TOKEN = le token du bot
  TELEGRAM_CHAT_ID   = l'ID du chat (ton ID perso ou groupe)
"""
import os
import asyncio
from datetime import datetime, timezone

import aiohttp

from config import TELEGRAM_BOT_TOKEN, TELEGRAM_CHAT_ID

_BASE_URL = f"https://api.telegram.org/bot{TELEGRAM_BOT_TOKEN}"


def is_configured() -> bool:
    """Vérifie si Telegram est configuré."""
    return bool(TELEGRAM_BOT_TOKEN and TELEGRAM_CHAT_ID)


async def _send_message(text: str, parse_mode: str = "HTML") -> bool:
    """Envoie un message Telegram. Retourne True si envoyé."""
    if not is_configured():
        return False
    try:
        timeout = aiohttp.ClientTimeout(total=10)
        async with aiohttp.ClientSession(timeout=timeout) as session:
            async with session.post(
                f"{_BASE_URL}/sendMessage",
                json={
                    "chat_id": TELEGRAM_CHAT_ID,
                    "text": text,
                    "parse_mode": parse_mode,
                    "disable_web_page_preview": True,
                },
            ) as resp:
                return resp.status == 200
    except Exception as e:
        print(f"  [TELEGRAM] Erreur envoi: {e}")
        return False


def _now() -> str:
    """Horodatage lisible."""
    return datetime.now(timezone.utc).strftime("%d/%m/%Y %H:%M UTC")


# ────────────────────────────────────────
# Notifications prédéfinies
# ────────────────────────────────────────

async def notify_ollama_down():
    """Ollama est injoignable."""
    await _send_message(
        f"🔴 <b>Ollama injoignable</b>\n\n"
        f"• Le double-ping a échoué\n"
        f"• La publication auto est <b>en pause</b>\n"
        f"• Elle reprendra automatiquement quand Ollama sera de retour\n\n"
        f"🕐 {_now()}"
    )


async def notify_ollama_back():
    """Ollama est de nouveau joignable."""
    await _send_message(
        f"🟢 <b>Ollama de retour</b>\n\n"
        f"• Publication automatique relancée\n\n"
        f"🕐 {_now()}"
    )


async def notify_article_published(title: str, category: str, source: str, ollama_used: bool):
    """Un article a été publié avec succès."""
    ia_tag = "✅ IA" if ollama_used else "⚠️ Fallback"
    await _send_message(
        f"📰 <b>Article publié</b>\n\n"
        f"• <b>{title}</b>\n"
        f"• Catégorie : {category}\n"
        f"• Source : {source}\n"
        f"• Réécriture : {ia_tag}\n\n"
        f"🕐 {_now()}"
    )


async def notify_article_failed(title: str, source: str, reason: str):
    """Un article a échoué (Ollama KO, erreur, etc.)."""
    await _send_message(
        f"⚠️ <b>Article non publié</b>\n\n"
        f"• <b>{title[:60]}</b>\n"
        f"• Source : {source}\n"
        f"• Raison : {reason}\n"
        f"• L'URL n'est pas marquée comme traitée — réessai au prochain cycle\n\n"
        f"🕐 {_now()}"
    )


async def notify_pipeline_complete(source: str, published: int, total: int, ollama_failures: int):
    """Résumé d'un pipeline terminé."""
    status = "✅" if published == total else "⚠️" if published > 0 else "❌"
    lines = [
        f"{status} <b>Pipeline terminé</b>\n",
        f"• Source : {source}",
        f"• Publiés : {published}/{total}",
    ]
    if ollama_failures > 0:
        lines.append(f"• Échecs Ollama : {ollama_failures}")
    if ollama_failures >= 2:
        lines.append(f"• ⛔ Pipeline stoppé (2 échecs consécutifs)")
    lines.append(f"\n🕐 {_now()}")
    await _send_message("\n".join(lines))


async def notify_auto_disabled(reason: str):
    """Le mode auto a été désactivé."""
    await _send_message(
        f"⛔ <b>Publication auto désactivée</b>\n\n"
        f"• Raison : {reason}\n\n"
        f"🕐 {_now()}"
    )


async def notify_daily_summary(total_articles: int, sources_count: int, ollama_ok: bool):
    """Résumé quotidien (à appeler via un cron ou manuellement)."""
    ollama_icon = "🟢" if ollama_ok else "🔴"
    await _send_message(
        f"📊 <b>Résumé NoMask</b>\n\n"
        f"• Articles en base : {total_articles}\n"
        f"• Sources actives : {sources_count}\n"
        f"• Ollama : {ollama_icon} {'OK' if ollama_ok else 'KO'}\n\n"
        f"🕐 {_now()}"
    )
