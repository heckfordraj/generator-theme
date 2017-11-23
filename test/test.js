var os = require('os');
var fs = require('fs');
var path = require('path');
var helpers = require('yeoman-test');
var assert = require('yeoman-assert');
var randomstring = require("randomstring");


describe('generator-theme', function () {

  describe('prompts: all', function() {

    beforeEach(function () {
      return helpers.run(path.join(__dirname, '../app'))
      .inDir(path.join(os.tmpdir(), randomstring.generate(7) + '/wp-content/themes/theme-name'))
      .withPrompts({
        name: 'Theme Name',
        sass: true,
        security: true,
      });
    });


    describe('generates', function() {

      it('.htaccess', function () {

        assert.file(path.resolve('../../../.htaccess'));
      });

      it('wp-config.php', function () {

        assert.file(path.resolve('../../../wp-config.php'));
      });

      it('robots.txt', function () {

        assert.file(path.resolve('../../../robots.txt'));
      });

      it('wp-content/.htaccess', function () {

        assert.file(path.resolve('../../.htaccess'));
      });

      it('.gitignore', function () {

        assert.file(path.resolve('.gitignore'));
      });

      it('gulpfile.js', function () {

        assert.file(path.resolve('gulpfile.js'));
      });

      it('package.json', function () {

        assert.file(path.resolve('package.json'));
      });

      it('theme/src/**/*.php', function () {

        assert.file(path.resolve('src/index.php'));
        assert.file(path.resolve('src/inc/reset.php'));
        assert.file(path.resolve('src/template-parts/content.php'));
      });

      it('theme/src/**/*.scss', function () {

        assert.file(path.resolve('src/style.scss'));
        assert.file(path.resolve('src/_sass/font.scss'));
      });
    });


    describe('should output', function() {

      it('package.json name', function () {

        assert.noJsonFileContent(path.resolve('package.json'), { "name": "<%= props.dir %>" });
      });

      it('gulpfile.js browser proxy', function () {

        assert.noFileContent(path.resolve('gulpfile.js'), /<%=.*%>/);
      });

      it('src/style.scss theme name and description', function () {

        assert.noFileContent(path.resolve('src/style.scss'), /<%=.*%>/);
      });
    });


    describe('shouldn\'t overwrite existing', function() {

      beforeEach(function () {
        return helpers.run(path.join(__dirname, '../app'))
        .inDir(path.join(os.tmpdir(), randomstring.generate(7) + '/wp-content/themes/theme-name'), function(dir){

          fs.writeFileSync(path.join(dir + '../../../../wp-config.php'), '<?php phpinfo(); ?>');
          fs.writeFileSync(path.join(dir + '../../../../.htaccess'), 'Redirect /old /new');
        })
        .withPrompts({
          name: 'Theme Name',
          sass: true,
          security: true,
        });
      });


      it('wp-config.php', function () {

        assert.file(path.resolve('../../../wp-config.php'));
        assert.fileContent(path.resolve('../../../wp-config.php'), /<\?php.*\?>/);
      });

      it('.htaccess', function () {

        assert.file(path.resolve('../../../.htaccess'));
        assert.fileContent(path.resolve('../../../.htaccess'), /Redirect/);
      });
    });

  });


  describe('prompts: sass', function() {

    beforeEach(function () {
      return helpers.run(path.join(__dirname, '../app'))
      .inDir(path.join(os.tmpdir(), randomstring.generate(7) + '/wp-content/themes/theme-name'))
      .withPrompts({
        sass: false
      });
    });


    it('generates default', function () {

      assert.file(path.resolve('.gitignore'));
    });

    it('doesn\'t generate sass', function () {

      assert.noFile(path.resolve('src/style.scss'));
    });
  });


  describe('prompts: security', function() {

    beforeEach(function () {
      return helpers.run(path.join(__dirname, '../app'))
      .inDir(path.join(os.tmpdir(), randomstring.generate(7) + '/wp-content/themes/theme-name'))
      .withPrompts({
        security: false
      });
    });

    it('generates default', function () {

      assert.file(path.resolve('.gitignore'));
    });

    it('doesn\'t generate security', function () {

      assert.noFile(path.resolve('../../../.htaccess'));
    });
  });

});
