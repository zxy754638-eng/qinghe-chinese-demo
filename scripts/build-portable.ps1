param(
  [string]$OutputPath = (Join-Path $PSScriptRoot '..\..\qinghe-chinese-portable-2026-10-07-v39.zip')
)

Add-Type -AssemblyName System.IO.Compression
Add-Type -AssemblyName System.IO.Compression.FileSystem

$projectRoot = [System.IO.Path]::GetFullPath((Join-Path $PSScriptRoot '..'))
$siteRoot = Join-Path $projectRoot 'dist'
$launcherRoot = Join-Path $projectRoot 'portable-package'
$resolvedOutput = [System.IO.Path]::GetFullPath($OutputPath)
$sitePrefix = $siteRoot.TrimEnd([char[]]'\/') + [System.IO.Path]::DirectorySeparatorChar

if(Test-Path -LiteralPath $resolvedOutput){
  throw "输出文件已经存在：$resolvedOutput"
}

$stream = [System.IO.File]::Open($resolvedOutput, [System.IO.FileMode]::CreateNew)
$archive = [System.IO.Compression.ZipArchive]::new($stream, [System.IO.Compression.ZipArchiveMode]::Create)

try {
  Get-ChildItem -LiteralPath $siteRoot -File -Recurse | ForEach-Object {
    # Windows PowerShell 5.1 uses an older .NET runtime without Path.GetRelativePath().
    $relative = $_.FullName.Substring($sitePrefix.Length).Replace('\', '/')
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
