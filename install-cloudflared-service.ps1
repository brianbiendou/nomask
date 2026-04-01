# ============================================================
# Installation de cloudflared comme service Windows
# DOIT être exécuté en PowerShell ADMINISTRATEUR
# ============================================================
#
# Ce script installe cloudflared comme service Windows pour que
# le tunnel api.nomask.fr → localhost:8000 reste actif 24/7,
# même après un redémarrage du PC.
#
# USAGE:
#   1. Clic droit sur PowerShell → "Exécuter en tant qu'administrateur"
#   2. cd C:\App\nomask
#   3. .\install-cloudflared-service.ps1
# ============================================================

# Vérifier les droits admin
$isAdmin = ([Security.Principal.WindowsPrincipal][Security.Principal.WindowsIdentity]::GetCurrent()).IsInRole([Security.Principal.WindowsBuiltInRole]::Administrator)
if (-not $isAdmin) {
    Write-Host "ERREUR: Ce script doit être exécuté en tant qu'Administrateur !" -ForegroundColor Red
    Write-Host "Clic droit sur PowerShell → 'Exécuter en tant qu'administrateur'" -ForegroundColor Yellow
    exit 1
}

Write-Host "=== Installation du service cloudflared ===" -ForegroundColor Cyan

# Vérifier que cloudflared est installé
$cf = Get-Command cloudflared -ErrorAction SilentlyContinue
if (-not $cf) {
    Write-Host "ERREUR: cloudflared n'est pas dans le PATH" -ForegroundColor Red
    exit 1
}
Write-Host "[OK] cloudflared trouvé: $($cf.Source)" -ForegroundColor Green

# Vérifier que le fichier config existe
$configFile = "$env:USERPROFILE\.cloudflared\config.yml"
if (-not (Test-Path $configFile)) {
    Write-Host "ERREUR: Config non trouvée: $configFile" -ForegroundColor Red
    exit 1
}
Write-Host "[OK] Config trouvée: $configFile" -ForegroundColor Green

# Vérifier si le service existe déjà
$existingService = Get-Service -Name "cloudflared" -ErrorAction SilentlyContinue
if ($existingService) {
    Write-Host "[INFO] Service cloudflared existe déjà (Status: $($existingService.Status))" -ForegroundColor Yellow
    Write-Host "Pour réinstaller: cloudflared service uninstall" -ForegroundColor Yellow
    exit 0
}

# Installer le service
Write-Host "`nInstallation du service..." -ForegroundColor Cyan
cloudflared service install
if ($LASTEXITCODE -ne 0) {
    Write-Host "ERREUR: Échec de l'installation du service" -ForegroundColor Red
    exit 1
}
Write-Host "[OK] Service installé" -ForegroundColor Green

# Démarrer le service
Write-Host "Démarrage du service..." -ForegroundColor Cyan
Start-Service -Name "cloudflared"
Start-Sleep -Seconds 3

# Vérifier le statut
$svc = Get-Service -Name "cloudflared"
if ($svc.Status -eq "Running") {
    Write-Host "`n=== SUCCÈS ===" -ForegroundColor Green
    Write-Host "Le tunnel cloudflared est actif comme service Windows." -ForegroundColor Green
    Write-Host "api.nomask.fr → localhost:8000 (actif 24/7)" -ForegroundColor Green
    Write-Host "`nCommandes utiles:" -ForegroundColor Cyan
    Write-Host "  Get-Service cloudflared          # Vérifier le statut"
    Write-Host "  Restart-Service cloudflared      # Redémarrer"
    Write-Host "  Stop-Service cloudflared         # Arrêter"
    Write-Host "  cloudflared service uninstall    # Désinstaller"
} else {
    Write-Host "ATTENTION: Le service est installé mais pas en cours d'exécution (Status: $($svc.Status))" -ForegroundColor Yellow
    Write-Host "Essayez: net start cloudflared" -ForegroundColor Yellow
}
