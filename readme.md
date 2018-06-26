# generator-theme

[![Build Status](https://travis-ci.org/heckfordraj/generator-theme.svg?branch=master)](https://travis-ci.org/heckfordraj/generator-theme) [![Coverage Status](https://coveralls.io/repos/github/heckfordraj/generator-theme/badge.svg?branch=master)](https://coveralls.io/github/heckfordraj/generator-theme?branch=master) [![Greenkeeper badge](https://badges.greenkeeper.io/heckfordraj/generator-theme.svg)](https://greenkeeper.io/)

A [Yeoman](https://www.npmjs.com/package/yo) generator that scaffolds a basic WP theme.

## Install

First, install [`yo`](https://www.npmjs.com/package/yo) (needed to generate the theme) and the theme itself:

```bash
yarn global add yo https://github.com/heckfordraj/generator-theme.git
```

This will install the command `yo` and the theme globally.

## Usage

Create a new theme folder in `wp-content/themes`:

```bash
mkdir theme-name
```

Navigate to the created folder:

```bash
cd theme-name
```

Generate the theme:

```bash
yo theme
```

## Questions

#### `Theme name`

The titlecase name of the theme as usually entered in the `theme/style.css`.  
_Default:_ humanised format of the theme directory name e.g. `Theme Name`

#### `What web server is this website going to be running on?`

The type of web server used in production. Used to decide whether to install `.htaccess`.  
_Default:_ `Apache`

#### `Include sass templates?`

Whether to install the sass boilerplates.  
_Default:_ `y`
