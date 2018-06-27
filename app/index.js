'use strict';
Object.defineProperty(exports, '__esModule', { value: true });
const Base = require('yeoman-generator');
const path_1 = require('path');
const helpers_1 = require('./helpers');
const yosay = require('yosay');
module.exports = class extends Base {
  constructor() {
    super(...arguments);
    this.answers = {};
  }
  initializing() {
    if (path_1.basename(path_1.dirname(this.destinationRoot())) !== 'themes') {
      this.log(
        yosay(
          'Failed to install. Are you running this from within a theme folder?'
        )
      );
      return this.env.error(new Error('Wrong directory'));
    }
    this.log(yosay('This will install a basic WP theme'));
  }
  prompting() {
    const questions = [
      {
        type: 'input',
        name: 'name',
        message: 'Theme name',
        default: helpers_1.helpers.humanise(
          helpers_1.helpers.dirName(this.destinationRoot())
        )
      },
      {
        type: 'list',
        name: 'server',
        message: 'What web server is this website going to be running on?',
        choices: ['Apache', 'Other'],
        default: 'Apache'
      },
      {
        type: 'confirm',
        name: 'sass',
        message: 'Include sass templates?',
        default: true
      }
    ];
    return this.prompt(questions).then(answers => (this.answers = answers));
  }
  writing() {
    this.fs.copy(
      this.templatePath('gitignore'),
      this.destinationPath('../../../.gitignore')
    );
    this.fs.copy(
      this.templatePath('robots.txt'),
      this.destinationPath('../../../robots.txt')
    );
    this.fs.copyTpl(
      this.templatePath('wp-content/themes/theme/**/*'),
      this.destinationPath(''),
      {
        answers: this.answers,
        helpers: helpers_1.helpers
      },
      null,
      {
        globOptions: {
          ignore: ['**/wp-content/themes/theme/src/_sass/*']
        }
      }
    );
    if (this.answers.server === 'Apache') {
      this.fs.copy(
        this.templatePath('htaccess'),
        this.destinationPath('../../../.htaccess')
      );
      this.fs.copy(
        this.templatePath('htaccess'),
        this.destinationPath('../../../wp-admin/.htaccess')
      );
    }
    if (this.answers.sass)
      this.fs.copy(
        this.templatePath('wp-content/themes/theme/src/_sass/*'),
        this.destinationPath('src/_sass')
      );
  }
  install() {
    this.installDependencies({ yarn: true, npm: false, bower: false });
  }
};
