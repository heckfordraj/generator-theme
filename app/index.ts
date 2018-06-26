import Base = require('yeoman-generator');
import { Question, Answers } from 'yeoman-generator';
import { basename, dirname } from 'path';
import { helpers } from './helpers';
import * as yosay from 'yosay';

module.exports = class extends Base {
  answers: Answers = {};

  initializing() {
    if (basename(dirname(this.destinationRoot())) !== 'themes') {
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
    const questions: Question[] = [
      {
        type: 'input',
        name: 'name',
        message: 'Theme name',
        default: helpers.humanise(helpers.dirName(this.destinationRoot()))
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
    // .gitignore
    this.fs.copy(
      this.templatePath('gitignore'),
      this.destinationPath('../../../.gitignore')
    );

    // robots.txt
    this.fs.copy(
      this.templatePath('robots.txt'),
      this.destinationPath('../../../robots.txt')
    );

    this.fs.copyTpl(
      this.templatePath('wp-content/themes/theme/**/*'),
      this.destinationPath(''),
      {
        answers: this.answers,
        helpers: helpers
      },
      null,
      {
        globOptions: {
          ignore: ['**/wp-content/themes/theme/src/_sass/*']
        }
      }
    );

    // .htaccess
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

    // _sass/*.scss
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
