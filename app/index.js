const Generator = require('yeoman-generator');
const path = require('path');
const s = require('underscore.string');
const yosay = require('yosay');

module.exports = class extends Generator {

  initializing() {

    this.log(yosay('This will install a blank theme inside a WP theme folder'));

    this.props = {};
    this.props.dir = path.basename(this.destinationRoot());
    this.props.name = s(this.props.dir).humanize().titleize().value();
  }


  prompting() {

    const prompts = {
      name: {
        type: 'input',
        name: 'name',
        message: 'Theme name',
        default: this.props.name
      },
      domain: {
        type: 'input',
        name: 'domain',
        message: 'Site domain',
        default: this.props.dir + '.local'
      },
      sass: {
        type: 'confirm',
        name: 'sass',
        message: 'Include sass templates?',
        default: 'true'
      },
      security: {
        type: 'confirm',
        name: 'security',
        message: 'Include security additions?',
        default: 'true'
      }
    };

    return this.prompt(prompts.name)
    .then((answer) => {

      this.props.name = answer.name;
      return this.prompt(prompts.domain)
    })
    .then((answer) => {

      this.props.domain = answer.domain;
      return this.prompt(prompts.sass)
    })
    .then((answer) => {

      this.props.sass = answer.sass;
      return this.prompt(prompts.security)
    })
    .then((answer) => {

      this.props.security = answer.security;
    });

  }

  _copyAppend(file, target) {

    try {

      if (this.fs.exists(target)) {

        let fileData = this.fs.read(
          this.templatePath(file)
        );

        this.fs.append(
          this.destinationPath(target),
          fileData
        );

      } else {

        this.fs.copy(
          this.templatePath(file),
          this.destinationPath(target)
        );
      }

    } catch(e) {

      this.log('Cannot access root folder. Are you running this from a theme folder?');
    }
  }


  writing() {

    if (this.props.security === true) {

      // root .htaccess
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
      this.fs.copy(
        this.templatePath('robots.txt'),
        this.destinationPath('../../../robots.txt')
      );

      // wp-content .htaccess
      this.fs.copy(
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

    // theme/src .php
    this.fs.copyTpl(
      this.templatePath('wp-content/themes/theme/src/**/*.php'),
      this.destinationPath('src'),
      { props: this.props }
    );

    if (this.props.sass === true) {

      // theme/src .scss
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
