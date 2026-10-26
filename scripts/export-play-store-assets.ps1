param([string]$FeatureGraphic)
$ErrorActionPreference = 'Stop'
Add-Type -AssemblyName System.Drawing
$root = Split-Path $PSScriptRoot -Parent
$output = Join-Path $root 'play-store-assets'
New-Item -ItemType Directory -Force -Path $output | Out-Null

function Export-Image([string]$Source, [string]$Name, [int]$Width, [int]$Height, [string]$Background) {
  $inputImage = [System.Drawing.Image]::FromFile((Resolve-Path -LiteralPath $Source).Path)
  $bitmap = New-Object System.Drawing.Bitmap($Width, $Height, ([System.Drawing.Imaging.PixelFormat]::Format24bppRgb))
  $graphics = [System.Drawing.Graphics]::FromImage($bitmap)
  try {
    $graphics.Clear([System.Drawing.ColorTranslator]::FromHtml($Background))
    $graphics.InterpolationMode = [System.Drawing.Drawing2D.InterpolationMode]::HighQualityBicubic
    $graphics.PixelOffsetMode = [System.Drawing.Drawing2D.PixelOffsetMode]::HighQuality
    $scale = [Math]::Min($Width / $inputImage.Width, $Height / $inputImage.Height)
    $drawWidth = [int][Math]::Round($inputImage.Width * $scale)
    $drawHeight = [int][Math]::Round($inputImage.Height * $scale)
    $graphics.DrawImage($inputImage, [int](($Width - $drawWidth) / 2), [int](($Height - $drawHeight) / 2), $drawWidth, $drawHeight)
    $bitmap.Save((Join-Path $output $Name), [System.Drawing.Imaging.ImageFormat]::Png)
  } finally {
    $graphics.Dispose()
    $bitmap.Dispose()
    $inputImage.Dispose()
  }
}

Export-Image (Join-Path $root 'assets/images/launcher-yellow.png') 'app-icon-512.png' 512 512 '#FFC83D'
Export-Image (Join-Path $root '.uat-screens/17-book.png') 'phone-01-book-cargo.png' 1080 1920 '#FFFFFF'
Export-Image (Join-Path $root '.uat-screens/21-local-parcel.png') 'phone-02-cargo-details.png' 1080 1920 '#FFFFFF'
$tabletScreens = @(
  @{ Source = '17-book.png'; Name = '01-book-cargo.png' },
  @{ Source = '21-local-parcel.png'; Name = '02-cargo-details.png' },
  @{ Source = '13-home.png'; Name = '03-home.png' },
  @{ Source = '14-shipments.png'; Name = '04-shipments.png' },
  @{ Source = '15-invoices.png'; Name = '05-bills.png' },
  @{ Source = 'local-clean-route.png'; Name = '06-local-route.png' },
  @{ Source = 'international-world-overview-fixed.png'; Name = '07-international-route.png' },
  @{ Source = 'minimal-cargo.png'; Name = '08-cargo-attachments.png' }
)
foreach ($size in @('tablet-7-inch', 'tablet-10-inch')) {
  New-Item -ItemType Directory -Force -Path (Join-Path $output $size) | Out-Null
  $width = if ($size -eq 'tablet-7-inch') { 1080 } else { 1440 }
  $height = if ($size -eq 'tablet-7-inch') { 1920 } else { 2560 }
  foreach ($screen in $tabletScreens) {
    Export-Image (Join-Path $root ".uat-screens/$($screen.Source)") "$size/$($screen.Name)" $width $height '#FFFFFF'
  }
  $files = @(Get-ChildItem -LiteralPath (Join-Path $output $size) -Filter '*.png')
  if ($files.Count -ne 8) { throw "Expected eight images in $size" }
  foreach ($file in $files) {
    $check = [System.Drawing.Image]::FromFile($file.FullName)
    try {
      if ($check.Width -ne $width -or $check.Height -ne $height -or $file.Length -gt 8MB) {
        throw "Invalid tablet asset: $($file.FullName)"
      }
    } finally { $check.Dispose() }
  }
  Write-Output "$size : verified eight PNG images at $width x $height, each under 8 MB"
}
if ($FeatureGraphic) {
  Export-Image $FeatureGraphic 'feature-graphic-1024x500.png' 1024 500 '#FFC83D'
}

Get-ChildItem -LiteralPath $output -Filter '*.png' | ForEach-Object {
  $image = [System.Drawing.Image]::FromFile($_.FullName)
  try {
    $limit = if ($_.Name -like 'app-icon*') { 1MB } elseif ($_.Name -like 'feature-*') { 15MB } else { 8MB }
    if ($_.Length -gt $limit) { throw "Asset exceeds upload limit: $($_.Name)" }
    [PSCustomObject]@{ File = $_.Name; Width = $image.Width; Height = $image.Height; Bytes = $_.Length }
  } finally { $image.Dispose() }
}
