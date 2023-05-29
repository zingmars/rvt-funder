:: Sets up symlinks on Windows.
:: Need to be run as administrator!
@ECHO OFF
echo Removing old symlinks.
rmdir locales\en-GB
rmdir locales\en-US
rmdir locales\lv-LV
rmdir locales\dev
rmdir public\locales\en-GB
rmdir public\locales\en-US
rmdir public\locales\lv-LV
rmdir public\locales\dev
echo Remaking symlinks.
mklink /D locales\en-GB en
mklink /D locales\en-US en
mklink /D locales\dev en
mklink /D locales\lv-LV lv
mklink /D public\locales\en-GB en
mklink /D public\locales\en-US en
mklink /D public\locales\dev en
mklink /D public\locales\lv-LV lv
echo Done.