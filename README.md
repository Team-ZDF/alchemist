# Alchemist
Open source ZDF packaging tool built on Electron

This project is developed alongside the ZDF specification. It is in no way ready for production. 1.0 will be the first production ready version and will be released after the finalized ZDF specification.

# Usage
Requirements:
* Node.js
* Grunt

To run Alchemist:

1. Clone the repository locally
1. Clone `node-zdf` locally (for the moment, Alchemist uses the local version. This will be a dependency in the future)
1. Run `npm install` from the root directory to pull dependencies
1. Run `grunt` from the root directory to start the application

The application will first prompt for a directory containing the files to package. Next, it will prompt for a destination file name and location. It will then package the file and open the directory containing the file.

Obviously, Alchemist is in its early stages of development. It is, at the moment, more of a proof of concept tool. As the specification is finalized and more development time is available, Alchemist will include a full GUI interface capable of modifying a ZDF Manifest, dragging and dropping files to include, previewing the document, signing/encrypting the document, and more. 

# Contributing
The ZDF project as a whole needs your support. If you're interested in working on Alchemist or any of the other pieces of the project, email [rtbenfield@gmail.com](mailto:rtbenfield@gmail.com).