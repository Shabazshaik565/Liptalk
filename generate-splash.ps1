Add-Type -AssemblyName System.Drawing

$bgCol = [System.Drawing.ColorTranslator]::FromHtml("#0B0F19")
$logoPath = "c:\Liptalk\mobile\assets\logo.png"
$splashPath = "c:\Liptalk\mobile\assets\splash.png"
$adaptivePath = "c:\Liptalk\mobile\assets\adaptive-icon.png"

$logo = [System.Drawing.Bitmap]::new($logoPath)

# 1. Generate Splash (1242 x 2436)
$splashWidth = 1242
$splashHeight = 2436
$splashBmp = [System.Drawing.Bitmap]::new($splashWidth, $splashHeight)
$g = [System.Drawing.Graphics]::FromImage($splashBmp)
$g.InterpolationMode = [System.Drawing.Drawing2D.InterpolationMode]::HighQualityBicubic
$g.SmoothingMode = [System.Drawing.Drawing2D.SmoothingMode]::HighQuality
$g.PixelOffsetMode = [System.Drawing.Drawing2D.PixelOffsetMode]::HighQuality
$g.TextRenderingHint = [System.Drawing.Text.TextRenderingHint]::ClearTypeGridFit

# Background
$bgBrush = [System.Drawing.SolidBrush]::new($bgCol)
$g.FillRectangle($bgBrush, 0, 0, $splashWidth, $splashHeight)

# Logo target size: 1040 width (occupies >84% of width for prominent appearance)
$targetLogoW = 1040
$targetLogoH = [int]($targetLogoW * $logo.Height / $logo.Width)
$targetLogoX = [int](($splashWidth - $targetLogoW) / 2)
$targetLogoY = [int](($splashHeight - $targetLogoH) / 2 - 50)

$g.DrawImage($logo, $targetLogoX, $targetLogoY, $targetLogoW, $targetLogoH)

# Slogan text
$font = [System.Drawing.Font]::new("Segoe UI", 26, [System.Drawing.FontStyle]::Bold)
$sloganBrush = [System.Drawing.SolidBrush]::new([System.Drawing.ColorTranslator]::FromHtml("#A78BFA"))
$stringFormat = [System.Drawing.StringFormat]::new()
$stringFormat.Alignment = [System.Drawing.StringAlignment]::Center

$g.DrawString("CONNECT   *   PROMOTE   *   GROW", $font, $sloganBrush, ($splashWidth / 2), ($targetLogoY + $targetLogoH + 40), $stringFormat)

# Subtitle text
$subFont = [System.Drawing.Font]::new("Segoe UI", 18, [System.Drawing.FontStyle]::Regular)
$subBrush = [System.Drawing.SolidBrush]::new([System.Drawing.ColorTranslator]::FromHtml("#94A3B8"))
$g.DrawString("Global Collective Intelligence & Opportunity Network", $subFont, $subBrush, ($splashWidth / 2), ($targetLogoY + $targetLogoH + 90), $stringFormat)

$splashBmp.Save($splashPath, [System.Drawing.Imaging.ImageFormat]::Png)
$g.Dispose()
$splashBmp.Dispose()
Write-Host "Generated prominent splash screen at $splashPath ($splashWidth x $splashHeight)"

# 2. Generate Adaptive Icon (432 x 432)
$iconSize = 432
$iconBmp = [System.Drawing.Bitmap]::new($iconSize, $iconSize)
$gIcon = [System.Drawing.Graphics]::FromImage($iconBmp)
$gIcon.InterpolationMode = [System.Drawing.Drawing2D.InterpolationMode]::HighQualityBicubic
$gIcon.SmoothingMode = [System.Drawing.Drawing2D.SmoothingMode]::HighQuality
$gIcon.PixelOffsetMode = [System.Drawing.Drawing2D.PixelOffsetMode]::HighQuality

$iconLogoW = 390
$iconLogoH = [int]($iconLogoW * $logo.Height / $logo.Width)
$iconLogoX = [int](($iconSize - $iconLogoW) / 2)
$iconLogoY = [int](($iconSize - $iconLogoH) / 2)

$gIcon.DrawImage($logo, $iconLogoX, $iconLogoY, $iconLogoW, $iconLogoH)
$iconBmp.Save($adaptivePath, [System.Drawing.Imaging.ImageFormat]::Png)
$gIcon.Dispose()
$iconBmp.Dispose()
Write-Host "Generated adaptive icon at $adaptivePath ($iconSize x $iconSize)"

$logo.Dispose()
