var os = require('os');
var fs = require('fs');
var path = require('path');
var test = require('yeoman-test');
var assert = require('yeoman-assert');
var sinon = require('sinon');
var randomstring = require("randomstring");

var helpers = require('../app/helpers.js');

var files = {
  default: [
    '.gitignore',
    'gulpfile.js',
    'package.json',
    'src/footer.php',
    'src/functions.php',
    'src/header.php',
    'src/index.php',
    'src/inc/reset.php',
    'src/inc/scripts.php',
    'src/template-parts/content.php'
  ],
  sass: [
    'src/style.scss',
    'src/_sass/font.scss',
    'src/_sass/grid.scss',
    'src/_sass/reset.scss'
  ],
  security: [
    '../../../.htaccess',
    '../../../wp-config.php',
    '../../../robots.txt',
    '../../.htaccess'
  ]
}


describe('generator-theme', function() {

  describe('should get', function() {

    var gen;

    beforeEach(function() {
      return test.run(path.join(__dirname, '../app'))
      .inDir(path.join(os.tmpdir(), randomstring.generate(7) + '/wp-content/themes/theme-name'))
      .withPrompts({
        name: 'Company Name',
        domain: 'company.dev',
        sass: false,
        security: false
      })
      .on('ready', function (generator) {

        gen = generator;
      });
    });


    it('current directory', function () {

      assert.textEqual(helpers.dir(), 'theme-name');
    });


    describe('answers', function() {

      it('name', function () {

        assert.textEqual(gen.props.name, 'Company Name');
      });

      it('domain', function () {

        assert.textEqual(gen.props.domain, 'company.dev');
      });

      it('sass', function () {

        assert.equal(gen.props.sass, false);
      });

      it('security', function () {

        assert.equal(gen.props.security, false);
      });
    });

  });


  describe('should transform', function() {

    var gen;

    beforeEach(function() {
      return test.run(path.join(__dirname, '../app'))
      .inDir(path.join(os.tmpdir(), randomstring.generate(7) + '/wp-content/themes/theme -Name'))
      .withPrompts({
        name: 'CoMpany   *na\me',
      })
      .on('ready', function (generator) {

        gen = generator;
      });
    });


    it('current directory to name', function () {

      assert.textEqual(helpers.name(), 'Theme Name');
    });

    it('default name to slug', function () {

      assert.textEqual(helpers.nameToSlug(helpers.name()), 'theme-name');
    });

    it('answer name to slug', function () {

      assert.textEqual(gen.props.domain, 'company-name.local');
    });
  });


  describe('should output', function() {

    beforeEach(function() {
      return test.run(path.join(__dirname, '../app'))
      .inDir(path.join(os.tmpdir(), randomstring.generate(7) + '/wp-content/themes/theme-name'))
      .withPrompts({
        sass: true,
        security: true
      })
    });

    it('package.json name', function() {

      assert.noJsonFileContent('package.json', { "name": "<%= props.nameToSlug %>" });
      assert.jsonFileContent('package.json', { "name": "theme-name" });
    });

    it('gulpfile.js browser proxy', function() {

      assert.noFileContent('gulpfile.js', /<%=.*%>/);
      assert.fileContent('gulpfile.js', 'theme-name.local');
    });

    it('src/style.scss theme name and description', function() {

      assert.noFileContent('src/style.scss', /<%=.*%>/);
      assert.fileContent('src/style.scss', 'Theme Name');
    });
  });


  describe('should not overwrite existing', function() {

    beforeEach(function() {
      return test.run(path.join(__dirname, '../app'))
      .inDir(path.join(os.tmpdir(), randomstring.generate(7) + '/wp-content/themes/theme-name'), function(dir){

        fs.writeFileSync(path.join(dir + '../../../../wp-config.php'), '<?php phpinfo(); ?>');
        fs.writeFileSync(path.join(dir + '../../../../.htaccess'), 'Redirect /old /new');
      })
      .withPrompts({
        sass: true,
        security: true
      });
    });


    it('wp-config.php', function() {

      assert.file('../../../wp-config.php');
      assert.fileContent('../../../wp-config.php', /<\?php.*\?>/);
    });

    it('.htaccess', function() {

      assert.file('../../../.htaccess');
      assert.fileContent('../../../.htaccess', /Redirect/);
    });
  });


  describe('should above theme dir', function() {

    var consoleSpy;

    beforeEach(function() {
      return test.run(path.join(__dirname, '../app'))
      .inDir(path.join(os.tmpdir(), '../private'))
      .withPrompts({
        security: true
      })
      .on('ready', function (generator) {

        // remove existing spy
        generator.log = function(){};

        // attach new spy
        consoleSpy = sinon.spy(generator, 'log');
        generator.log = consoleSpy;
      });
    });


    it('not output security', function() {

      assert.noFile(files.security);
    });

    it('output console log', function() {

      // initializing (1), errors (4), install (1)
      assert.equal(consoleSpy.callCount, 6);
    });
  });


  describe('prompts:', function() {

    describe('all', function() {

      beforeEach(function() {
        return test.run(path.join(__dirname, '../app'))
        .inDir(path.join(os.tmpdir(), randomstring.generate(7) + '/wp-content/themes/theme-name'))
        .withPrompts({
          sass: true,
          security: true
        })
      });


      describe('should generate', function() {

        it('default', function() {

          assert.file(files.default);
        });

        it('sass', function() {

          assert.file(files.sass);
        });

        it('security', function() {

          assert.file(files.security);
        });
      });

    });


    describe('sass', function() {

      beforeEach(function() {
        return test.run(path.join(__dirname, '../app'))
        .inDir(path.join(os.tmpdir(), randomstring.generate(7) + '/wp-content/themes/theme-name'))
        .withPrompts({
          sass: false
        });
      });


      describe('should generate', function() {

        it('default', function() {

          assert.file(files.default);
        });
      });


      describe('should not generate', function() {

        it('sass', function() {

          assert.noFile(files.sass);
        });
      });

    });


    describe('security', function() {

      beforeEach(function() {
        return test.run(path.join(__dirname, '../app'))
        .inDir(path.join(os.tmpdir(), randomstring.generate(7) + '/wp-content/themes/theme-name'))
        .withPrompts({
          security: false
        });
      });


      describe('should generate', function() {

        it('default', function() {

          assert.file(files.default);
        });
      });


      describe('should not generate', function() {

        it('security', function() {

          assert.noFile(files.security);
        });
      });

    });
  });

});
