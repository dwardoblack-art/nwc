param(
  [Parameter(Mandatory = $true)][string]$Bundle,
  [Parameter(Mandatory = $true)][string]$Bundletool,
  [string]$JavaHome = 'C:/Program Files/Java/jdk-17',
  [string]$ReadElf = 'C:/Users/AYOO/AppData/Local/Android/Sdk/ndk/27.1.12297006/toolchains/llvm/prebuilt/windows-x86_64/bin/llvm-readelf.exe'
)
$ErrorActionPreference = 'Stop'
$bundlePath = (Resolve-Path -LiteralPath $Bundle).Path
$java = Join-Path $JavaHome 'bin/java.exe'
$jarsigner = Join-Path $JavaHome 'bin/jarsigner.exe'
$signature = & $jarsigner -verify $bundlePath 2>&1 | Out-String
if ($LASTEXITCODE -ne 0 -or $signature -notmatch 'jar verified') { throw "Bundle signature verification failed: $signature" }
& $java -jar $Bundletool validate "--bundle=$bundlePath"
if ($LASTEXITCODE -ne 0) { throw 'Bundletool validation failed.' }
$manifestText = & $java -jar $Bundletool dump manifest "--bundle=$bundlePath" --module=base | Out-String
if ($LASTEXITCODE -ne 0) { throw 'Could not read bundle manifest.' }
[xml]$manifest = $manifestText
$android = 'http://schemas.android.com/apk/res/android'
if ($manifest.manifest.package -ne 'com.nwcargo.app') { throw 'Unexpected package.' }
$sdk = $manifest.manifest.'uses-sdk'.GetAttribute('targetSdkVersion', $android)
if ([int]$sdk -lt 36) { throw "Target SDK is $sdk; expected at least 36." }
if ($manifest.manifest.application.GetAttribute('debuggable', $android) -eq 'true') { throw 'Bundle is debuggable.' }
$permissions = @($manifest.manifest.'uses-permission' | ForEach-Object { $_.GetAttribute('name', $android) })
$blocked = @('RECORD_AUDIO', 'WRITE_CONTACTS', 'READ_EXTERNAL_STORAGE', 'WRITE_EXTERNAL_STORAGE', 'READ_MEDIA_IMAGES', 'READ_MEDIA_VIDEO', 'SYSTEM_ALERT_WINDOW', 'ACCESS_BACKGROUND_LOCATION')
foreach ($permission in $blocked) {
  if ($permissions -contains "android.permission.$permission") { throw "Unwanted release permission: $permission" }
}
$configText = & $java -jar $Bundletool dump config "--bundle=$bundlePath" | Out-String
if ($LASTEXITCODE -ne 0 -or $configText -notmatch 'PAGE_ALIGNMENT_16K') { throw 'Bundle does not declare 16 KB ZIP alignment.' }
Add-Type -AssemblyName System.IO.Compression.FileSystem
$archive = [System.IO.Compression.ZipFile]::OpenRead($bundlePath)
$scratch = Join-Path (Split-Path $bundlePath) 'native-alignment-check'
New-Item -ItemType Directory -Force -Path $scratch | Out-Null
$checked = 0
try {
  foreach ($entry in $archive.Entries) {
    if ($entry.FullName -notmatch '^base/lib/arm64-v8a/[^/]+\.so$') { continue }
    $destination = Join-Path $scratch $entry.Name
    [System.IO.Compression.ZipFileExtensions]::ExtractToFile($entry, $destination, $true)
    $headers = & $ReadElf -lW $destination
    if ($LASTEXITCODE -ne 0) { throw "Could not read ELF headers: $($entry.Name)" }
    $loadSegments = @($headers | Where-Object { $_ -match '^\s*LOAD\s' })
    if ($loadSegments.Count -eq 0) { throw "No load segments: $($entry.Name)" }
    foreach ($line in $loadSegments) {
      $alignment = ($line.Trim() -split '\s+')[-1]
      if ([Convert]::ToInt64($alignment.Substring(2), 16) -lt 16384) { throw "4 KB native library: $($entry.Name) ($alignment)" }
    }
    $checked++
  }
} finally { $archive.Dispose() }
if ($checked -eq 0) { throw 'No arm64 native libraries found.' }
Write-Output "Verified signed release bundle, target API $sdk, permissions, 16 KB ZIP alignment, and $checked arm64 native libraries."
Write-Output "Version code: $($manifest.manifest.GetAttribute('versionCode', $android))"
Write-Output "Permissions: $($permissions -join ', ')"
Get-FileHash -LiteralPath $bundlePath -Algorithm SHA256
