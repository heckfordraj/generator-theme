var Generator = require('yeoman-generator');
var path = require('path');
var s = require("underscore.string");

module.exports = class extends Generator {



  initializing() {
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
        default: this.props.name,
        validate: function(input){
          return new Promise((resolve, reject) => {

            input.length <= 0 ? reject('Please enter a name') : resolve(true);
          });
        }
      },
      domain: {
        type: 'input',
        name: 'domain',
        message: 'Site domain',
        default: this.props.dir + '.local'
      }
    };

    return this.prompt(prompts.name)
    .then((answer) => {

      this.props.name = answer.name;

      return this.prompt(prompts.domain)
      .then((answer) => {

        this.props.domain = answer.domain;
      });
    })

  }



  _appendFile(file, target) {

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
  }

  writing() {


    // root .htaccess
    this._appendFile(
      this.templatePath('.htaccess'),
      this.destinationPath('../../../.htaccess')
    )


    // wp-config.php
    this._appendFile(
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
      this.templatePath('wp-content/.htaccess'),
      this.destinationPath('../../.htaccess')
    );


    // .gitignore
    this.fs.copy(
      this.templatePath('wp-content/themes/theme/.gitignore'),
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


    // theme/src
    this.fs.copyTpl(
      this.templatePath('wp-content/themes/theme/src'),
      this.destinationPath('src'),
      { props: this.props }
    );

  }

  install() {
    this.installDependencies({ bower: false });
  }



};
