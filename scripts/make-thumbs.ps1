# 갤러리 썸네일 일괄 생성
# 사용법: PowerShell에서 프로젝트 루트로 이동 후 .\scripts\make-thumbs.ps1 실행

Add-Type -AssemblyName System.Drawing

$inputDir  = Join-Path $PSScriptRoot "..\images\gallery"
$outputDir = Join-Path $inputDir "thumb"
$maxWidth  = 600
$quality   = 80L

if (-not (Test-Path $outputDir)) {
    New-Item -ItemType Directory -Path $outputDir | Out-Null
}

$encoder = [System.Drawing.Imaging.ImageCodecInfo]::GetImageEncoders() |
    Where-Object { $_.MimeType -eq 'image/jpeg' }

Get-ChildItem -Path $inputDir -File -Filter "*.jpg" | ForEach-Object {
    $inputPath  = $_.FullName
    $outputPath = Join-Path $outputDir ($_.BaseName.ToLower() + ".jpg")

    $img    = [System.Drawing.Image]::FromFile($inputPath)
    $ratio  = $maxWidth / $img.Width
    if ($ratio -ge 1) { $ratio = 1 }
    $newW   = [int]($img.Width  * $ratio)
    $newH   = [int]($img.Height * $ratio)

    $bmp = New-Object System.Drawing.Bitmap($newW, $newH)
    $g   = [System.Drawing.Graphics]::FromImage($bmp)
    $g.InterpolationMode = [System.Drawing.Drawing2D.InterpolationMode]::HighQualityBicubic
    $g.SmoothingMode     = [System.Drawing.Drawing2D.SmoothingMode]::HighQuality
    $g.PixelOffsetMode   = [System.Drawing.Drawing2D.PixelOffsetMode]::HighQuality
    $g.DrawImage($img, 0, 0, $newW, $newH)

    $params = New-Object System.Drawing.Imaging.EncoderParameters(1)
    $params.Param[0] = New-Object System.Drawing.Imaging.EncoderParameter(
        [System.Drawing.Imaging.Encoder]::Quality, $quality)
    $bmp.Save($outputPath, $encoder, $params)

    $g.Dispose(); $bmp.Dispose(); $img.Dispose()
    $sizeKB = [math]::Round((Get-Item $outputPath).Length / 1KB, 1)
    Write-Host ("[OK] {0} -> {1}x{2}  ({3} KB)" -f $_.Name, $newW, $newH, $sizeKB)
}

Write-Host "`n완료! 썸네일은 $outputDir 에 저장되었습니다."
