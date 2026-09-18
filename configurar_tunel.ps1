$ErrorActionPreference = "Stop"

# ============================================================
# CONFIGURACION
# ============================================================

$vitePort = 4210

$googleOAuthUrl = "https://console.cloud.google.com/auth/clients/235572611522-in6ucvoaet1tdd2bkkrlqdk2e1pqs26f.apps.googleusercontent.com?authuser=2&project=telerin-497618"

$tempLog = Join-Path $env:TEMP "telerin_cloudflared.log"

# Carpeta donde esta este script
$scriptFolder = Split-Path -Parent $MyInvocation.MyCommand.Path

# Carpeta para herramientas descargadas
$toolsFolder = Join-Path $scriptFolder "herramientas"

# Ejecutable de Cloudflared
$cloudflaredPath = Join-Path $toolsFolder "cloudflared.exe"

# URL oficial de descarga
$cloudflaredDownloadUrl = "https://github.com/cloudflare/cloudflared/releases/latest/download/cloudflared-windows-amd64.exe"


# ============================================================
# CREAR CARPETA HERRAMIENTAS
# ============================================================

if (-not (Test-Path $toolsFolder)) {

    Write-Host ""
    Write-Host "Creando carpeta herramientas..." -ForegroundColor Cyan

    New-Item `
        -ItemType Directory `
        -Path $toolsFolder `
        -Force | Out-Null
}


# ============================================================
# BUSCAR CLOUDFLARED
# ============================================================

# Primero buscamos dentro de herramientas
if (-not (Test-Path $cloudflaredPath)) {

    Write-Host ""
    Write-Host "Cloudflared no esta dentro de herramientas." -ForegroundColor Yellow

    # Buscar si existe instalado globalmente
    $cloudflaredCommand = Get-Command cloudflared.exe -ErrorAction SilentlyContinue

    if ($cloudflaredCommand) {

        Write-Host "Se encontro Cloudflared instalado en el sistema." -ForegroundColor Green

        $globalCloudflared = $cloudflaredCommand.Source

        # Copiarlo tambien a herramientas
        Copy-Item `
            -Path $globalCloudflared `
            -Destination $cloudflaredPath `
            -Force

        Write-Host "Cloudflared fue copiado a herramientas." -ForegroundColor Green
    }
}


# ============================================================
# DESCARGAR CLOUDFLARED SI NO EXISTE
# ============================================================

if (-not (Test-Path $cloudflaredPath)) {

    Write-Host ""
    Write-Host "Cloudflared no esta instalado." -ForegroundColor Yellow
    Write-Host "Descargando Cloudflared..." -ForegroundColor Cyan
    Write-Host ""

    Invoke-WebRequest `
        -Uri $cloudflaredDownloadUrl `
        -OutFile $cloudflaredPath `
        -UseBasicParsing

    Write-Host ""
    Write-Host "Cloudflared descargado correctamente." -ForegroundColor Green
}


# ============================================================
# VERIFICAR CLOUDFLARED
# ============================================================

if (-not (Test-Path $cloudflaredPath)) {
    throw "No se pudo encontrar cloudflared.exe."
}

Write-Host ""
Write-Host "Verificando Cloudflared..." -ForegroundColor Cyan

$cloudflareVersion = & $cloudflaredPath --version 2>&1

if ($LASTEXITCODE -ne 0) {
    throw "Cloudflare no pudo ejecutarse."
}

Write-Host $cloudflareVersion -ForegroundColor DarkGray
Write-Host "Cloudflared esta listo." -ForegroundColor Green


# ============================================================
# CERRAR TUNELES ANTERIORES
# ============================================================

Write-Host ""
Write-Host "Cerrando tuneles anteriores..." -ForegroundColor Cyan

Get-Process cloudflared -ErrorAction SilentlyContinue |
Stop-Process -Force -ErrorAction SilentlyContinue


# ============================================================
# LIMPIAR LOG ANTERIOR
# ============================================================

if (Test-Path $tempLog) {
    Remove-Item $tempLog -Force -ErrorAction SilentlyContinue
}


# ============================================================
# CREAR QUICK TUNNEL
# ============================================================

Write-Host ""
Write-Host "Creando tunel de Cloudflare..." -ForegroundColor Cyan
Write-Host "Esperando URL publica..." -ForegroundColor Yellow
Write-Host ""

$cloudflared = Start-Process `
    -FilePath $cloudflaredPath `
    -ArgumentList "tunnel --url http://localhost:$vitePort" `
    -RedirectStandardError $tempLog `
    -PassThru `
    -WindowStyle Hidden


# ============================================================
# ESPERAR URL
# ============================================================

$tunnelUrl = $null

for ($i = 0; $i -lt 30; $i++) {

    Start-Sleep -Seconds 1

    if (Test-Path $tempLog) {

        $logContent = Get-Content `
            -Path $tempLog `
            -Raw `
            -ErrorAction SilentlyContinue

        if ($logContent) {

            $match = [regex]::Match(
                $logContent,
                "https://[a-z0-9-]+\.trycloudflare\.com"
            )

            if ($match.Success) {
                $tunnelUrl = $match.Value
                break
            }
        }
    }
}


# ============================================================
# VERIFICAR TUNEL
# ============================================================

if (-not $tunnelUrl) {

    Write-Host ""
    Write-Host "No se pudo obtener la URL de Cloudflare." -ForegroundColor Red
    Write-Host ""

    if (Test-Path $tempLog) {
        Write-Host "Log de Cloudflare:" -ForegroundColor Yellow
        Get-Content $tempLog
    }

    throw "No se pudo crear el Quick Tunnel."
}


# ============================================================
# MOSTRAR URL
# ============================================================

Write-Host ""
Write-Host "============================================================" -ForegroundColor Green
Write-Host "                 TUNEL CREADO" -ForegroundColor Green
Write-Host "============================================================" -ForegroundColor Green
Write-Host ""
Write-Host "URL publica:" -ForegroundColor Cyan
Write-Host $tunnelUrl -ForegroundColor White
Write-Host ""

# Copiar URL al portapapeles
Set-Clipboard -Value $tunnelUrl

Write-Host "La URL fue copiada al portapapeles." -ForegroundColor Green
Write-Host ""


# ============================================================
# GUIA DE GOOGLE CLOUD
# ============================================================

Write-Host "============================================================" -ForegroundColor Cyan
Write-Host "              CONFIGURACION DE GOOGLE" -ForegroundColor Cyan
Write-Host "============================================================" -ForegroundColor Cyan
Write-Host ""

Write-Host "Antes de continuar, lee las instrucciones." -ForegroundColor Yellow
Write-Host ""
Write-Host "El navegador se abrira en la configuracion de Google Cloud." -ForegroundColor White
Write-Host "En cada paso te dire exactamente que debes hacer." -ForegroundColor White
Write-Host ""
Write-Host "Cuando termines cada paso, vuelve a esta ventana." -ForegroundColor Yellow
Write-Host "Presiona ENTER para continuar al siguiente paso." -ForegroundColor Yellow
Write-Host ""

Read-Host "Presiona ENTER cuando hayas leido las instrucciones"


# ============================================================
# PASO 1
# ============================================================

Write-Host ""
Write-Host "============================================================" -ForegroundColor Cyan
Write-Host "PASO 1 - VERIFICAR EL TUNEL" -ForegroundColor Cyan
Write-Host "============================================================" -ForegroundColor Cyan
Write-Host ""

Write-Host "Esta es la URL que debes agregar en Google Cloud:" -ForegroundColor White
Write-Host ""
Write-Host $tunnelUrl -ForegroundColor Green
Write-Host ""

Write-Host "La URL ya esta copiada." -ForegroundColor Green
Write-Host "No necesitas copiarla manualmente." -ForegroundColor White
Write-Host ""

Read-Host "Presiona ENTER para abrir Google Cloud"


# ============================================================
# ABRIR GOOGLE CLOUD
# ============================================================

Start-Process $googleOAuthUrl

Start-Sleep -Seconds 2


# ============================================================
# PASO 2
# ============================================================

Write-Host ""
Write-Host "============================================================" -ForegroundColor Cyan
Write-Host "PASO 2 - GOOGLE CLOUD" -ForegroundColor Cyan
Write-Host "============================================================" -ForegroundColor Cyan
Write-Host ""

Write-Host "En la pagina que se acaba de abrir:" -ForegroundColor White
Write-Host ""
Write-Host "1. Busca la seccion:" -ForegroundColor White
Write-Host ""
Write-Host "   Origenes autorizados de JavaScript" -ForegroundColor Green
Write-Host ""

Read-Host "Cuando encuentres esa seccion, vuelve aqui y presiona ENTER"


# ============================================================
# PASO 3
# ============================================================

Write-Host ""
Write-Host "============================================================" -ForegroundColor Cyan
Write-Host "PASO 3 - AGREGAR URI" -ForegroundColor Cyan
Write-Host "============================================================" -ForegroundColor Cyan
Write-Host ""

Write-Host "En Google Cloud:" -ForegroundColor White
Write-Host ""
Write-Host "1. Busca el boton:" -ForegroundColor White
Write-Host ""
Write-Host "   AGREGAR URI" -ForegroundColor Green
Write-Host ""
Write-Host "2. Haz clic en AGREGAR URI." -ForegroundColor White
Write-Host ""

Read-Host "Cuando hayas hecho clic, vuelve aqui y presiona ENTER"


# ============================================================
# PASO 4
# ============================================================

Write-Host ""
Write-Host "============================================================" -ForegroundColor Cyan
Write-Host "PASO 4 - PEGAR URL" -ForegroundColor Cyan
Write-Host "============================================================" -ForegroundColor Cyan
Write-Host ""

Write-Host "Ahora aparecerá un campo nuevo." -ForegroundColor White
Write-Host ""
Write-Host "Haz clic dentro del campo." -ForegroundColor White
Write-Host ""
Write-Host "Presiona:" -ForegroundColor White
Write-Host ""
Write-Host "   CTRL + V" -ForegroundColor Green
Write-Host ""

Write-Host "Se pegara automaticamente esta URL:" -ForegroundColor White
Write-Host ""
Write-Host $tunnelUrl -ForegroundColor Green
Write-Host ""

Write-Host "IMPORTANTE:" -ForegroundColor Yellow
Write-Host "No agregues una barra / al final." -ForegroundColor Yellow
Write-Host ""

Read-Host "Cuando hayas pegado la URL, vuelve aqui y presiona ENTER"


# ============================================================
# PASO 5
# ============================================================

Write-Host ""
Write-Host "============================================================" -ForegroundColor Cyan
Write-Host "PASO 5 - GUARDAR" -ForegroundColor Cyan
Write-Host "============================================================" -ForegroundColor Cyan
Write-Host ""

Write-Host "Ahora vuelve a Google Cloud." -ForegroundColor White
Write-Host ""
Write-Host "Busca el boton:" -ForegroundColor White
Write-Host ""
Write-Host "   GUARDAR" -ForegroundColor Green
Write-Host ""
Write-Host "Haz clic en GUARDAR." -ForegroundColor White
Write-Host ""
Write-Host "Espera unos segundos hasta que Google confirme el cambio." -ForegroundColor Yellow
Write-Host ""

Read-Host "Cuando hayas guardado correctamente, vuelve aqui y presiona ENTER"



# ============================================================
# PASO 6
# ============================================================

Write-Host ""
Write-Host "============================================================" -ForegroundColor Cyan
Write-Host "PASO 6 - CERRAR GOOGLE CLOUD" -ForegroundColor Cyan
Write-Host "============================================================" -ForegroundColor Cyan
Write-Host ""

Write-Host "Ya terminaste la configuracion de Google." -ForegroundColor Green
Write-Host ""
Write-Host "Puedes cerrar la pestaña de Google Cloud." -ForegroundColor White
Write-Host ""
Write-Host "Despues vuelve a esta ventana." -ForegroundColor White
Write-Host ""

Read-Host "Cuando hayas cerrado Google Cloud, presiona ENTER"


# ============================================================
# PASO 7
# ============================================================

Write-Host ""
Write-Host "============================================================" -ForegroundColor Green
Write-Host "PASO 7 - ABRIR TELERIN" -ForegroundColor Green
Write-Host "============================================================" -ForegroundColor Green
Write-Host ""

Write-Host "Todo esta configurado." -ForegroundColor Green
Write-Host ""
Write-Host "Abriendo TeleRin..." -ForegroundColor Cyan
Write-Host ""

Start-Process $tunnelUrl


# ============================================================
# FINAL
# ============================================================

Write-Host ""
Write-Host "============================================================" -ForegroundColor Green
Write-Host "                  TELERIN LISTO" -ForegroundColor Green
Write-Host "============================================================" -ForegroundColor Green
Write-Host ""

Write-Host "URL publica:" -ForegroundColor White
Write-Host $tunnelUrl -ForegroundColor Green
Write-Host ""

Write-Host "IMPORTANTE:" -ForegroundColor Yellow
Write-Host "No cierres esta ventana mientras estes usando TeleRin." -ForegroundColor Yellow
Write-Host ""
Write-Host "Si cierras esta ventana, el tunel de Cloudflare se cerrara." -ForegroundColor Yellow
Write-Host ""

Read-Host "Presiona ENTER para cerrar el tunel y terminar"