param([switch]$NoBrowser)

$ErrorActionPreference = "Stop"
$siteRoot = [IO.Path]::GetFullPath((Join-Path $PSScriptRoot "site"))

if (-not (Test-Path -LiteralPath (Join-Path $siteRoot "index.html") -PathType Leaf)) {
    throw "site/index.html was not found. Extract the complete ZIP package first."
}

$listener = $null
$siteUrl = $null
foreach ($port in 8765..8775) {
    $url = "http://127.0.0.1:$port/"
    try {
        $candidate = [Net.Sockets.TcpListener]::new([Net.IPAddress]::Loopback, [int]$port)
        $candidate.Start()
        $listener = $candidate
        $siteUrl = $url
        break
    } catch {
        if ($null -ne $candidate) { $candidate.Stop() }
    }
}

if ($null -eq $listener) {
    throw "Ports 8765 through 8775 are unavailable. Close the program using them and try again."
}

$contentTypes = @{
    ".html" = "text/html; charset=utf-8"
    ".js" = "text/javascript; charset=utf-8"
    ".css" = "text/css; charset=utf-8"
    ".json" = "application/json; charset=utf-8"
    ".svg" = "image/svg+xml"
    ".png" = "image/png"
    ".jpg" = "image/jpeg"
    ".jpeg" = "image/jpeg"
    ".webmanifest" = "application/manifest+json; charset=utf-8"
    ".txt" = "text/plain; charset=utf-8"
}

function Write-HttpResponse {
    param(
        [IO.Stream]$Stream,
        [int]$StatusCode,
        [string]$Reason,
        [string]$ContentType,
        [byte[]]$Body,
        [bool]$HeadOnly
    )
    $header = "HTTP/1.1 $StatusCode $Reason`r`nContent-Type: $ContentType`r`nContent-Length: $($Body.Length)`r`nCache-Control: no-cache`r`nConnection: close`r`n`r`n"
    $headerBytes = [Text.Encoding]::ASCII.GetBytes($header)
    $Stream.Write($headerBytes, 0, $headerBytes.Length)
    if (-not $HeadOnly -and $Body.Length -gt 0) {
        $Stream.Write($Body, 0, $Body.Length)
    }
}

Write-Host "Qinghe Chinese is running at $siteUrl" -ForegroundColor Green
Write-Host "Keep this window open. Close it to stop the local site." -ForegroundColor DarkGray
if (-not $NoBrowser) { Start-Process $siteUrl }

$rootPrefix = $siteRoot.TrimEnd([IO.Path]::DirectorySeparatorChar) + [IO.Path]::DirectorySeparatorChar
try {
    while ($true) {
        $client = $listener.AcceptTcpClient()
        $stream = $client.GetStream()
        try {
            $reader = [IO.StreamReader]::new($stream, [Text.Encoding]::ASCII, $false, 1024, $true)
            $requestLine = $reader.ReadLine()
            while ($null -ne ($headerLine = $reader.ReadLine()) -and $headerLine.Length -gt 0) { }
            $parts = $requestLine -split " "
            if ($parts.Length -lt 2) {
                Write-HttpResponse $stream 400 "Bad Request" "text/plain; charset=utf-8" ([Text.Encoding]::UTF8.GetBytes("Bad Request")) $false
                continue
            }

            $method = $parts[0].ToUpperInvariant()
            $requestPath = ($parts[1] -split "\?", 2)[0]
            $relativePath = [Uri]::UnescapeDataString($requestPath.TrimStart("/"))
            if ([string]::IsNullOrWhiteSpace($relativePath)) { $relativePath = "index.html" }
            $relativePath = $relativePath.Replace("/", [IO.Path]::DirectorySeparatorChar)
            $filePath = [IO.Path]::GetFullPath((Join-Path $siteRoot $relativePath))

            if (-not $filePath.StartsWith($rootPrefix, [StringComparison]::OrdinalIgnoreCase)) {
                Write-HttpResponse $stream 403 "Forbidden" "text/plain; charset=utf-8" ([Text.Encoding]::UTF8.GetBytes("Forbidden")) ($method -eq "HEAD")
            } elseif (Test-Path -LiteralPath $filePath -PathType Leaf) {
                $bytes = [IO.File]::ReadAllBytes($filePath)
                $extension = [IO.Path]::GetExtension($filePath).ToLowerInvariant()
                $contentType = if ($contentTypes.ContainsKey($extension)) { $contentTypes[$extension] } else { "application/octet-stream" }
                Write-HttpResponse $stream 200 "OK" $contentType $bytes ($method -eq "HEAD")
            } else {
                Write-HttpResponse $stream 404 "Not Found" "text/plain; charset=utf-8" ([Text.Encoding]::UTF8.GetBytes("Not Found")) ($method -eq "HEAD")
            }
        } catch {
            if ($stream.CanWrite) {
                Write-HttpResponse $stream 500 "Internal Server Error" "text/plain; charset=utf-8" ([Text.Encoding]::UTF8.GetBytes("Internal Server Error")) $false
            }
        } finally {
            $stream.Close()
            $client.Close()
        }
    }
} finally {
    $listener.Stop()
}
