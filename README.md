# Facebook react + material-ui skeleton

This is a basic setup for [facebook react](http://facebook.github.io/react/index.html) and [material-ui](http://callemall.github.io/material-ui/#/)
skeleton application. Uses grunt for installation and packaging.

The source dependency tree is managed by [browserify](http://browserify.org/). Edit gruntfile based on your needs.

## Installation

[nodejs](http://nodejs.org/) must be installed on the system.

Install dependencies:

    npm install -g jsxhint grunt-cli
    npm install

Run grunt in development mode, with **watch** and **connect** to serve it in a browser:

    grunt

**NOTE:** export **BROWSER** environment variable if it cannot open the page..

To build a release with minifications:

    grunt release --env=production

**NOTE:** an environment can be specified to load **<%= environment %>.json** as configuration options for application
can be related to web api base urls, websocket and such configuration.

### Adapt to your project

Update git repository.

    rm -r .git
    git init
    git remote add origin git@your:/repo/origin.git

Update package version and name:

    vim package.json

