# Проверка доступности порта 9222 для Chrome DevTools (Windows 11)
$port = 9222
$connection = Test-NetConnection -ComputerName localhost -Port $port -InformationLevel Quiet

if ($connection) {
    Write-Host "Порт $port занят. Chrome DevTools может быть уже запущен." -ForegroundColor Yellow
    Write-Host "Проверьте: http://localhost:$port/json" -ForegroundColor Cyan
} else {
    Write-Host "Порт $port свободен. Запустите Chrome с удаленной отладкой." -ForegroundColor Green
}

