const Generator = require('yeoman-generator');
const fs = require('fs');
const path = require('path');
const helpers = require('./helpers.js');
const yosay = require('yosay');
const chalk = require('chalk');


module.exports = class extends Generator {

  initializing() {

    this.log(yosay('This will install a basic WP theme'));

    this.props = {};
    this.props.dir = helpers.dir();
    this.props.name = helpers.name();
    this.props.nameToSlug = () => helpers.nameToSlug(this.props.name);
  }


  prompting() {

    const prompts = {
      name: () => {
        return {
          type: 'input',
          name: 'name',
          message: 'Theme name',
          default: this.props.name
        };
      },
      domain: () => {
        return {
          type: 'input',
          name: 'domain',
          message: 'Site domain',
          default: this.props.nameToSlug() + '.local'
        };
      },
      sass: () => {
        return {
          type: 'confirm',
          name: 'sass',
          message: 'Include sass templates?',
          default: 'true'
        };
      },
      security: () => {
        return {
          type: 'confirm',
          name: 'security',
          message: 'Include security additions?',
          default: 'true'
        };
      }
    };

    return this.prompt(prompts.name())
    .then((answer) => {

      this.props.name = answer.name;
      return this.prompt(prompts.domain())
    })
    .then((answer) => {

      this.props.domain = answer.domain;
      return this.prompt(prompts.sass())
    })
    .then((answer) => {

      this.props.sass = answer.sass;
      return this.prompt(prompts.security())
    })
    .then((answer) => {

      this.props.security = answer.security;
    });

  }


  _tryCopy(file, target) {

    try {

      // check if user has permissions to write to target directory
      fs.accessSync(path.dirname(target), fs.constants.W_OK);
      this.fs.copy(file, target);

    } catch (e) {

      this.log(chalk.bgRedBright(`Failed to install ${path.basename(file)}. Are you running this from within a theme folder?`));
    }
  }

  _copyAppend(file, target) {

    if (this.fs.exists(target)) {

      let fileData = this.fs.read(file);
      this.fs.append(target, fileData);

    } else {

      this._tryCopy(file, target);
    }
  }


  writing() {

    if (this.props.security === true) {

      // .htaccess
      this._copyAppend(
        this.templatePath('htaccess'),
        this.destinationPath('../../../.htaccess')
      )

      // wp-config.php
      this._copyAppend(
        this.templatePath('wp-config.php'),
        this.destinationPath('../../../wp-config.php')
      )

      // robots.txt
      this._tryCopy(
        this.templatePath('robots.txt'),
        this.destinationPath('../../../robots.txt')
      );

      // wp-content/.htaccess
      this._tryCopy(
        this.templatePath('wp-content/htaccess'),
        this.destinationPath('../../.htaccess')
      );
    }

    // .gitignore
    this.fs.copy(
      this.templatePath('wp-content/themes/theme/gitignore'),
      this.destinationPath('.gitignore')
    );

    // gulpfile.js
    this.fs.copyTpl(
      this.templatePath('wp-content/themes/theme/gulpfile.js'),
      this.destinationPath('gulpfile.js'),
      { props: this.props }
    );

    // package.json
    this.fs.copyTpl(
      this.templatePath('wp-content/themes/theme/package.json'),
      this.destinationPath('package.json'),
      { props: this.props }
    );

    // readme.md
    this.fs.copyTpl(
      this.templatePath('wp-content/themes/theme/readme.md'),
      this.destinationPath('readme.md')
    );

    // theme/src/**/*.php
    this.fs.copyTpl(
      this.templatePath('wp-content/themes/theme/src/**/*.php'),
      this.destinationPath('src'),
      { props: this.props }
    );

    if (this.props.sass === true) {

      // theme/src/**/*.scss
      this.fs.copyTpl(
        this.templatePath('wp-content/themes/theme/src/**/*.scss'),
        this.destinationPath('src'),
        { props: this.props }
      );
    }

  }


  install() {

    this.installDependencies({ bower: false });
  }

};
