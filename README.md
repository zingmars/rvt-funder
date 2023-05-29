# About

This is my final school year project for Rigas Valsts Tehnikums (Riga State technical school) - a fundraising site.

This is a GitHub back-up of my project. It features a (mostly) functional fundraising website written in Node.JS. The original project was written in 2016 in roughly 2 months.

# Requirements

A Windows or Linux system with node.js and NPM installed. If you're pushing this to a production server, Nginx or Apache2 with `mod_proxy` is recommended.

# Installation instructions

1) Run setup.sh or setup.bat depending on your operating system
2) Run ‘npm install’ while in the directory the project's in. This will download all the required packages. Don't forget to run "npm update -g" to update your global packages.
3) Rename one of the .sample files in /config/env/ to a .json5 file (i.e. - development.json5.sample -> development.json5). Open it and fill it out. The values should be self explanatory.
4) If you chose a custom name for your json5 config file set the `NODE_ENV` PATH value to it's filename sans the extension. (By default it will use developmnent.json5, so you can use that for a quicker setup).
5) Create a table on your database management system (default is MySQL. To change this edit the sequelize's dialect variable in config/sequelize.js).
6) Run the app by running the command ‘grunt’ from the main directory of this app. It will run the app and automatically create all the tables for you.
7) Disable force sync in /config/env/all.json5 to prevent it from overwriting your database every time you start grunt.
8) Navigate to https://127.0.0.1:3001/ (You can disable forced HTTPS by commenting out the Force SSL section in app.js).
9) Enjoy.

# Launching instructions

To run it just run the `grunt` command while in the project’s directory. Grunt will handle everything and will listen to connections.

# Notes

1) To reset your database edit the variable `FORCE_DB_SYNC` in /config/env/all.json5. Set it to true and run grunt. Don't forget to set it to false afterwards or it's going to wipe your data.
2) You might need to install packages bower and Grunt globally ("npm install -g grunt" and "npm install -g bower") to run them from command line.

# License

(C)2016 Ingmārs Meļķis. Uses components licensed under the MIT license (see MIT.LICENSE).
