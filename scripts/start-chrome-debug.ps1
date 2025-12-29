# Запуск Chrome с удаленной отладкой для MCP server (Windows 11)
# Использование: .\scripts\start-chrome-debug.ps1

# Определение пути к Chrome (стандартные расположения в Windows 11)
$chromePaths = @(
    "C:\Program Files\Google\Chrome\Application\chrome.exe",
    "C:\Program Files (x86)\Google\Chrome\Application\chrome.exe",
    "$env:LOCALAPPDATA\Google\Chrome\Application\chrome.exe"
)

$chromePath = $null
foreach ($path in $chromePaths) {
    if (Test-Path $path) {
        $chromePath = $path
        break
    }
}

if (-not $chromePath) {
    Write-Error "Chrome не найден. Установите Google Chrome или укажите путь вручную."
    exit 1
}

# Создание временной директории для профиля пользователя
$userDataDir = "$env:TEMP\chrome-debug-mcp"
if (-not (Test-Path $userDataDir)) {
    New-Item -ItemType Directory -Path $userDataDir -Force | Out-Null
}

Write-Host "Запуск Chrome с удаленной отладкой..." -ForegroundColor Green
Write-Host "Порт отладки: 9222" -ForegroundColor Yellow
Write-Host "Профиль пользователя: $userDataDir" -ForegroundColor Yellow

# Запуск Chrome с параметрами удаленной отладки
& $chromePath `
  --remote-debugging-port=9222 `
  --remote-debugging-address=127.0.0.1 `
  --user-data-dir=$userDataDir `
  --no-first-run `
  --disable-default-apps `
  --disable-extensions

Write-Host "Chrome запущен. MCP server может подключиться к порту 9222." -ForegroundColor Green

