# ─────────────────────────────────────────────
# Script à exécuter UNE SEULE FOIS en tant qu'Administrateur
# Clic droit sur ce fichier → "Exécuter avec PowerShell" en admin
# OU ouvre PowerShell Admin et tape: powershell -File "C:\App\nomask\docker\install-tunnel-service.ps1"
# ─────────────────────────────────────────────

Write-Host "=== Installation du service Cloudflare Tunnel ===" -ForegroundColor Cyan

# 1. Vérifier si déjà installé
$svc = Get-Service -Name "cloudflared" -ErrorAction SilentlyContinue
if ($svc) {
    Write-Host "Le service cloudflared est déjà installé. Status: $($svc.Status)" -ForegroundColor Yellow
    if ($svc.Status -ne "Running") {
        Write-Host "Démarrage du service..." -ForegroundColor Yellow
        net start cloudflared
    }
    Write-Host "Terminé." -ForegroundColor Green
    Read-Host "Appuie sur Entrée pour fermer"
    exit 0
}

# 2. Vérifier que la config existe
$configPath = "$env:USERPROFILE\.cloudflared\config.yml"
if (-not (Test-Path $configPath)) {
    Write-Host "ERREUR: $configPath n'existe pas !" -ForegroundColor Red
    Write-Host "Lance d'abord 'cloudflared tunnel login' et 'cloudflared tunnel create'" -ForegroundColor Red
    Read-Host "Appuie sur Entrée pour fermer"
    exit 1
}

Write-Host "Config trouvée: $configPath" -ForegroundColor Green

# 3. Installer le service
Write-Host "Installation du service cloudflared..." -ForegroundColor Cyan
cloudflared service install
if ($LASTEXITCODE -ne 0) {
    Write-Host "ERREUR: Installation échouée. Es-tu bien en mode Administrateur ?" -ForegroundColor Red
    Read-Host "Appuie sur Entrée pour fermer"
    exit 1
}

# 4. Démarrer le service
Write-Host "Démarrage du service..." -ForegroundColor Cyan
net start cloudflared

# 5. Vérifier
Start-Sleep -Seconds 2
$svc = Get-Service -Name "cloudflared" -ErrorAction SilentlyContinue
if ($svc -and $svc.Status -eq "Running") {
    Write-Host ""
    Write-Host "=== SERVICE CLOUDFLARED INSTALLE ET ACTIF ===" -ForegroundColor Green
    Write-Host "Le tunnel api.nomask.fr -> localhost:8000 est maintenant permanent." -ForegroundColor Green
    Write-Host "Il redémarrera automatiquement avec Windows." -ForegroundColor Green
} else {
    Write-Host "ERREUR: Le service ne semble pas démarré correctement." -ForegroundColor Red
    Write-Host "Vérifie avec: sc query cloudflared" -ForegroundColor Yellow
}

Write-Host ""
Read-Host "Appuie sur Entrée pour fermer"
