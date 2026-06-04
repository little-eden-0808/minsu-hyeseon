# Family PNG 리사이즈 (투명 배경 유지)
# 원본을 백업한 후 가로 1200px로 줄임

Add-Type -AssemblyName System.Drawing

$dir       = Join-Path $PSScriptRoot "..\images\family"
$backupDir = Join-Path $dir "original"
$maxWidth  = 1200

if (-not (Test-Path $backupDir)) {
    New-Item -ItemType Directory -Path $backupDir | Out-Null
}

Get-ChildItem -Path $dir -File -Filter "*.png" | ForEach-Object {
    $inputPath  = $_.FullName
    $backupPath = Join-Path $backupDir $_.Name

    # 원본 백업
    if (-not (Test-Path $backupPath)) {
        Copy-Item $inputPath $backupPath
    }

    $img = [System.Drawing.Image]::FromFile($inputPath)
    $origW = $img.Width
    $origH = $img.Height

    if ($origW -le $maxWidth) {
        $img.Dispose()
        Write-Host ("[SKIP] {0} 이미 작음 ({1}x{2})" -f $_.Name, $origW, $origH)
        return
    }

    $ratio = $maxWidth / $origW
    $newW  = $maxWidth
    $newH  = [int]($origH * $ratio)

    $bmp = New-Object System.Drawing.Bitmap($newW, $newH, [System.Drawing.Imaging.PixelFormat]::Format32bppArgb)
    $g   = [System.Drawing.Graphics]::FromImage($bmp)
    $g.InterpolationMode = [System.Drawing.Drawing2D.InterpolationMode]::HighQualityBicubic
    $g.SmoothingMode     = [System.Drawing.Drawing2D.SmoothingMode]::HighQuality
    $g.PixelOffsetMode   = [System.Drawing.Drawing2D.PixelOffsetMode]::HighQuality
    $g.CompositingQuality = [System.Drawing.Drawing2D.CompositingQuality]::HighQuality
    $g.Clear([System.Drawing.Color]::Transparent)
    $g.DrawImage($img, 0, 0, $newW, $newH)

    $img.Dispose()

    # 임시 파일로 저장 후 교체
    $tempPath = $inputPath + ".tmp"
    $bmp.Save($tempPath, [System.Drawing.Imaging.ImageFormat]::Png)
    $g.Dispose()
    $bmp.Dispose()

    Move-Item -Force $tempPath $inputPath
    $newSizeMB = [math]::Round((Get-Item $inputPath).Length / 1MB, 2)
    $origSizeMB = [math]::Round((Get-Item $backupPath).Length / 1MB, 2)
    Write-Host ("[OK] {0}: {1}x{2} ({3}MB) -> {4}x{5} ({6}MB)" -f $_.Name, $origW, $origH, $origSizeMB, $newW, $newH, $newSizeMB)
}

Write-Host "`n완료! 원본은 $backupDir 에 백업되어 있습니다."
Write-Host "추가 최적화 원하시면 tinypng.com 에 한 번 더 돌려보세요."
