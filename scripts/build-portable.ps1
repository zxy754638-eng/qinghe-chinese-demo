param(
  [string]$OutputPath = (Join-Path $PSScriptRoot '..\..\青禾中文-可移动演示版-2026-10-04-v30.zip')
)

Add-Type -AssemblyName System.IO.Compression
Add-Type -AssemblyName System.IO.Compression.FileSystem

$projectRoot = [System.IO.Path]::GetFullPath((Join-Path $PSScriptRoot '..'))
$siteRoot = Join-Path $projectRoot 'dist'
$launcherRoot = Join-Path $projectRoot 'portable-package'
$resolvedOutput = [System.IO.Path]::GetFullPath($OutputPath)

if(Test-Path -LiteralPath $resolvedOutput){
  throw "输出文件已经存在：$resolvedOutput"
}

$stream = [System.IO.File]::Open($resolvedOutput, [System.IO.FileMode]::CreateNew)
$archive = [System.IO.Compression.ZipArchive]::new($stream, [System.IO.Compression.ZipArchiveMode]::Create)

try {
  Get-ChildItem -LiteralPath $siteRoot -File -Recurse | ForEach-Object {
    $relative = [System.IO.Path]::GetRelativePath($siteRoot, $_.FullName).Replace('\', '/')
    [System.IO.Compression.ZipFileExtensions]::CreateEntryFromFile($archive, $_.FullName, "site/$relative", [System.IO.Compression.CompressionLevel]::Optimal) | Out-Null
  }
  Get-ChildItem -LiteralPath $launcherRoot -File | ForEach-Object {
    [System.IO.Compression.ZipFileExtensions]::CreateEntryFromFile($archive, $_.FullName, $_.Name, [System.IO.Compression.CompressionLevel]::Optimal) | Out-Null
  }
}
finally {
  $archive.Dispose()
  $stream.Dispose()
}

Write-Output $resolvedOutput
