# Theme

## Structure

The theme will be generated into `dist`. This folder is wiped before every run, so do not make any changes in this folder.

Files with the extensions `php|html|jpg|png|gif|svg|ico` in any directory will be copied over by default to the build directory.

Use `src/assets` to keep static files and any other files you want to include in the theme. The contents of this folder will be copied entirely to `dist/assets`.

## Usage

First install the development dependencies:

```bash
npm install
```

To generate the files, launch a local web server, and watch for changes, use:

```bash
npm run serve
```

To generate the files only, use:

```bash
npm run build
```

You can target a build environment by using the flags `--dev` (default) or `--prod`.

### Development (default)

SASS to CSS (includes sourcemaps)

### Production

SASS to CSS (with Autoprefixer, CleanCSS)
JS (with UglifyJS)
Images (jpg, png, gif, svg with Imagemin)
