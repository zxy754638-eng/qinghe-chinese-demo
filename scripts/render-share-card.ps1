param(
  [string]$OutputPath = (Join-Path $PSScriptRoot '..\dist\share-card.png')
)

Add-Type -AssemblyName System.Drawing

$bitmap = [System.Drawing.Bitmap]::new(1200, 630)
$graphics = [System.Drawing.Graphics]::FromImage($bitmap)
$graphics.SmoothingMode = [System.Drawing.Drawing2D.SmoothingMode]::AntiAlias
$graphics.TextRenderingHint = [System.Drawing.Text.TextRenderingHint]::ClearTypeGridFit

try {
  $background = [System.Drawing.ColorTranslator]::FromHtml('#f7f3e7')
  $paper = [System.Drawing.ColorTranslator]::FromHtml('#fffdf7')
  $sage = [System.Drawing.ColorTranslator]::FromHtml('#dfe7d6')
  $sageDark = [System.Drawing.ColorTranslator]::FromHtml('#cbd8bf')
  $leaf = [System.Drawing.ColorTranslator]::FromHtml('#60735a')
  $ink = [System.Drawing.ColorTranslator]::FromHtml('#29322a')
  $muted = [System.Drawing.ColorTranslator]::FromHtml('#748073')

  $graphics.Clear($background)
  $graphics.FillEllipse([System.Drawing.SolidBrush]::new($sage), 790, -185, 560, 560)
  $graphics.FillEllipse([System.Drawing.SolidBrush]::new($sageDark), -160, 420, 420, 300)
  $graphics.FillRectangle([System.Drawing.SolidBrush]::new($paper), 70, 64, 1060, 502)

  $leafBrush = [System.Drawing.SolidBrush]::new($leaf)
  $paperBrush = [System.Drawing.SolidBrush]::new($paper)
  $inkBrush = [System.Drawing.SolidBrush]::new($ink)
  $mutedBrush = [System.Drawing.SolidBrush]::new($muted)
  $sageBrush = [System.Drawing.SolidBrush]::new($sage)
  $graphics.FillEllipse($leafBrush, 116, 111, 92, 92)

  $logoFont = [System.Drawing.Font]::new('Microsoft YaHei', 31, [System.Drawing.FontStyle]::Bold, [System.Drawing.GraphicsUnit]::Pixel)
  $brandFont = [System.Drawing.Font]::new('Microsoft YaHei', 26, [System.Drawing.FontStyle]::Bold, [System.Drawing.GraphicsUnit]::Pixel)
  $titleFont = [System.Drawing.Font]::new('Microsoft YaHei', 66, [System.Drawing.FontStyle]::Bold, [System.Drawing.GraphicsUnit]::Pixel)
  $subtitleFont = [System.Drawing.Font]::new('Microsoft YaHei', 27, [System.Drawing.FontStyle]::Regular, [System.Drawing.GraphicsUnit]::Pixel)
  $pillFont = [System.Drawing.Font]::new('Microsoft YaHei', 23, [System.Drawing.FontStyle]::Bold, [System.Drawing.GraphicsUnit]::Pixel)

  $graphics.DrawString('禾', $logoFont, $paperBrush, 136, 130)
  $graphics.DrawString('青禾中文  QINGHE CHINESE', $brandFont, $leafBrush, 232, 135)
  $graphics.DrawString('把中文学进真实生活里', $titleFont, $inkBrush, 116, 252)
  $graphics.DrawString('HSK 场景课程 · 分类背词 · 学习词典 · 间隔复习', $subtitleFont, $mutedBrush, 120, 365)
  $graphics.FillRectangle($sageBrush, 120, 450, 420, 60)
  $graphics.DrawString('中文内容 · 中英文界面', $pillFont, $leafBrush, 150, 464)

  $outputDirectory = Split-Path -Parent $OutputPath
  if(-not (Test-Path -LiteralPath $outputDirectory)){
    New-Item -ItemType Directory -Path $outputDirectory | Out-Null
  }
  $bitmap.Save($OutputPath, [System.Drawing.Imaging.ImageFormat]::Png)
}
finally {
  $graphics.Dispose()
  $bitmap.Dispose()
}
