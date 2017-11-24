# generator-theme
[![Build Status](https://travis-ci.org/heckfordraj/generator-theme.svg?branch=master)](https://travis-ci.org/heckfordraj/generator-theme) [![Coverage Status](https://coveralls.io/repos/github/heckfordraj/generator-theme/badge.svg?branch=master)](https://coveralls.io/github/heckfordraj/generator-theme?branch=master) [![Greenkeeper badge](https://badges.greenkeeper.io/heckfordraj/generator-theme.svg)](https://greenkeeper.io/)

A [Yeoman](https://www.npmjs.com/package/yo) generator that scaffolds a basic WP theme.


## Install

First, install [`yo`](https://www.npmjs.com/package/yo) (needed to generate the theme) and the theme itself using `npm`:

```bash
npm install -g yo https://github.com/heckfordraj/generator-theme.git
```

This will install the command ```yo``` and the theme globally.


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

*Default:* humanized format of the theme directory name e.g. `Theme Name`


#### `Site domain`

The domain of the site hosted locally. This will be used as the proxy path.

*Default:* slugified format of the theme directory name e.g. `theme-name`


#### `Include sass templates?`

Whether to install the sass boilerplate.

*Default:* `y`


#### `Include security additions?`

Whether to install the `.htaccess`, `wp-config.php`, and `robots.txt` additions. Will update the root `.htaccess`, update `wp-config.php`, add a root `robots.txt`, and add a `wp-content/.htaccess`.

*Default:* `y`


## Tests

```bash
npm test
```
