Add-Type -AssemblyName System.Drawing
$img = [System.Drawing.Image]::FromFile("d:\Igo-websites\Igo-Agri estate\public\images\logo.png")
$size = $img.Height
$rect = New-Object System.Drawing.Rectangle(0, 0, $size, $size)
$bmp = New-Object System.Drawing.Bitmap($size, $size)
$gfx = [System.Drawing.Graphics]::FromImage($bmp)
$gfx.DrawImage($img, $rect, $rect, [System.Drawing.GraphicsUnit]::Pixel)
$bmp.Save("d:\Igo-websites\Igo-Agri estate\public\favicon.png", [System.Drawing.Imaging.ImageFormat]::Png)
$img.Dispose()
$bmp.Dispose()
$gfx.Dispose()
Write-Output "Favicon created successfully."
