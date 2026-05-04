# Funk & Love Deploy Script
$ErrorActionPreference = "Stop"

# Load env
$envFile = ".env.local"
if (-not (Test-Path $envFile)) {
    Write-Host "Error: $envFile not found" -ForegroundColor Red
    exit 1
}

Get-Content $envFile | ForEach-Object {
    if ($_ -match "^\s*([^#][^=]+)=(.*)$") {
        $name = $matches[1].Trim()
        $value = $matches[2].Trim()
        Set-Variable -Name $name -Value $value
    }
}

$BUCKET = "oss://$OSS_BUCKET"

Write-Host ""
Write-Host "========================================"
Write-Host "  Funk & Love Deploy"
Write-Host "========================================"
Write-Host ""
Write-Host "Target: $BUCKET"
Write-Host "Endpoint: $OSS_ENDPOINT"
Write-Host ""

$confirm = Read-Host "Deploy to $OSS_BUCKET ? (y/N)"
if ($confirm -ne "y" -and $confirm -ne "Y") {
    Write-Host "Cancelled"
    exit 0
}

# Build
Write-Host ""
Write-Host "[1/2] Building..."
npm run build
if ($LASTEXITCODE -ne 0) {
    Write-Host "Build failed" -ForegroundColor Red
    exit 1
}

if (-not (Test-Path "out")) {
    Write-Host "Error: out directory not found" -ForegroundColor Red
    exit 1
}

# Upload
Write-Host ""
Write-Host "[2/2] Uploading to OSS..."
ossutil sync out/ $BUCKET/ --delete -e $OSS_ENDPOINT -i $OSS_ACCESS_KEY_ID -k $OSS_ACCESS_KEY_SECRET --force
if ($LASTEXITCODE -ne 0) {
    Write-Host "Upload failed" -ForegroundColor Red
    exit 1
}

Write-Host ""
Write-Host "========================================"
Write-Host "  Deploy Success!"
Write-Host "========================================"
Write-Host ""
