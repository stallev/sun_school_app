# Script to fix incorrect $ in links
$files = Get-ChildItem -Path "docs/implementation/mvp/tasks" -Filter "phase_*.md" | Where-Object { $_.Name -ne "phase_13_lessons.md" }

foreach ($file in $files) {
    Write-Host "Fixing: $($file.Name)"
    $content = Get-Content $file.FullName -Raw -Encoding UTF8
    
    # Fix incorrect $ in links
    $content = $content -replace '\]\(\$\.\.\/\.\.\/\.\.\/', '](../../../'
    
    Set-Content -Path $file.FullName -Value $content -NoNewline -Encoding UTF8
    Write-Host "  Done: $($file.Name)"
}

Write-Host "`nAll files fixed!"



