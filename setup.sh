#!/bin/bash 
# Sets up symlinks on Linux
function remove {
	rm dev
	rm en-GB
	rm en-US
	rm lv-LV
}
function symlink {
	ln -s en dev
	ln -s en en-GB
	ln -s en en-US
	ln -s lv lv-LV
}

echo "Removing server side symlinks (if exists)"
cd locales
remove
echo "Creating server side symlinks"
symlink

echo "Removing client side symlinks"
cd ../public/locales
remove
echo "Creating server side symlinks"
symlink