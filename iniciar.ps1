$ErrorActionPreference = "Stop"
[Console]::InputEncoding = [System.Text.Encoding]::UTF8
[Console]::OutputEncoding = [System.Text.Encoding]::UTF8
$OutputEncoding = [System.Text.Encoding]::UTF8
$env:PYTHONIOENCODING = "utf-8" 
chcp 65001 > $null

$root = Split-Path -Parent $MyInvocation.MyCommand.Path
$backendPath = Join-Path $root "TeleRin_backend"
$composeFile = Join-Path $root "docker-compose.yml"
function Get-WifiIp { 
    $priorityPatterns = @("Wi-Fi", "WLAN", "Wireless", "802.11")

    foreach ($pattern in $priorityPatterns) {
        $ip = Get-NetIPAddress -AddressFamily IPv4 -ErrorAction SilentlyContinue |
        Where-Object {
            $_.IPAddress -notlike "127.*" -and
            $_.PrefixOrigin -ne "WellKnown" -and
            $_.InterfaceAlias -like "*$pattern*"
        } |
        Sort-Object SkipAsSource |
        Select-Object -ExpandProperty IPAddress -First 1

        if ($ip) {
            return $ip
        }
    }

    $fallback = Get-NetIPAddress -AddressFamily IPv4 -ErrorAction SilentlyContinue |
    Where-Object {
        $_.IPAddress -notlike "127.*" -and
        $_.IPAddress -notlike "172.1*" -and
        $_.InterfaceAlias -notmatch "vEthernet|WSL|Docker|Loopback|Virtual|VMware|Hyper-V|Tailscale|ZeroTier"
    } |
    Sort-Object InterfaceMetric, SkipAsSource |
    Select-Object -ExpandProperty IPAddress -First 1

    return $fallback
}

function Ensure-DockerServices {
    $definedServices = docker compose -f $composeFile config --services 2>$null
    $existingServices = docker compose -f $composeFile ps -a --services 2>$null

    if (-not $definedServices) {
        throw "No se pudieron leer los servicios definidos en $composeFile."
    }

    $missingServices = @($definedServices | Where-Object { $_ -notin $existingServices })

    if ($existingServices -and $missingServices.Count -eq 0) {
        Write-Host "Iniciando contenedores existentes con docker compose start..." -ForegroundColor Cyan
        docker compose -f $composeFile start | Out-Host
    }
    else {
        if ($missingServices.Count -gt 0) {
            Write-Host "Faltan servicios por crear: $($missingServices -join ', ')" -ForegroundColor Yellow
        }
        Write-Host "Creando o completando contenedores con docker compose up -d..." -ForegroundColor Cyan
        docker compose -f $composeFile up -d | Out-Host
    }
}

function Test-ServiceRunning {
    param(
        [Parameter(Mandatory = $true)]
        [string]$ServiceName
    )

    $runningServices = docker compose -f $composeFile ps --services --status running 2>$null
    return $ServiceName -in $runningServices
}

function Start-DockerLogsWindow {
    $logsCommand = "chcp 65001 > `$null; [Console]::InputEncoding = [System.Text.Encoding]::UTF8; [Console]::OutputEncoding = [System.Text.Encoding]::UTF8; `$OutputEncoding = [System.Text.Encoding]::UTF8; docker compose -f '$composeFile' logs -f"
    Start-Process powershell -ArgumentList @(
        "-NoExit",
        "-ExecutionPolicy", "Bypass",
        "-Command", $logsCommand
    ) -WindowStyle Normal | Out-Null
}

function Show-Qr {
    param(
        [Parameter(Mandatory = $true)]
        [string]$Ip
    )

    $url = "http://${Ip}:4210"
    Clear-Host
    Write-Host "TeleRin QR Host" -ForegroundColor Green
    Write-Host ""
    Write-Host "Frontend compartido en: $url" -ForegroundColor Yellow
    Write-Host "Atajos:" -ForegroundColor DarkGray
    Write-Host "  Ctrl+Shift+R -> regenerar QR manualmente" -ForegroundColor DarkGray
    Write-Host "  Ctrl+Shift+Q -> salir" -ForegroundColor DarkGray
    Write-Host ""

    if (-not (Test-ServiceRunning -ServiceName "telerin")) {
        Write-Host "El servicio 'telerin' no esta corriendo. Revisa 'docker compose logs telerin'." -ForegroundColor Red
        return
    }

    docker compose -f $composeFile exec -T telerin python generarQR.py --url $url | Out-Host
}

Ensure-DockerServices
Start-DockerLogsWindow

$ultimaIp = $null

while ($true) {
    $ipActual = Get-WifiIp

    if (-not $ipActual) {
        if ($ultimaIp) {
            $ultimaIp = $null
            Clear-Host
            Write-Host "No se encontro una IP Wi-Fi/local valida. Esperando reconexion..." -ForegroundColor Red
            Write-Host ""
            Write-Host "Atajos disponibles:" -ForegroundColor DarkGray
            Write-Host "  Ctrl+Shift+R -> reintentar ahora" -ForegroundColor DarkGray
            Write-Host "  Ctrl+Shift+Q -> salir" -ForegroundColor DarkGray
            Write-Host "(Espera un poco despues de hacer Ctrl+Shift+R o Ctrl+Shift+Q)"
        }
    }
    elseif ($ipActual -ne $ultimaIp) {
        $ultimaIp = $ipActual
        Show-Qr -Ip $ipActual
    }

    if ([Console]::KeyAvailable) {
        $key = [Console]::ReadKey($true)
        $ctrlShift = (
            ($key.Modifiers -band [ConsoleModifiers]::Control) -and
            ($key.Modifiers -band [ConsoleModifiers]::Shift)
        )

        if ($ctrlShift -and $key.Key -eq [ConsoleKey]::R) {
            $ipManual = Get-WifiIp
            if ($ipManual) {
                $ultimaIp = $ipManual
                Show-Qr -Ip $ipManual
            }
            else {
                Clear-Host
                Write-Host "No se pudo regenerar el QR porque no hay IP valida disponible." -ForegroundColor Red
            }
        }
        elseif ($ctrlShift -and $key.Key -eq [ConsoleKey]::Q) {
            break
        }
    }

    Start-Sleep -Seconds 3
}
