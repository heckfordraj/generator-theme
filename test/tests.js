const os = require('os');
const fs = require('fs');
const path = require('path');
const test = require('yeoman-test');
const assert = require('yeoman-assert');
const sinon = require('sinon');
const randomstring = require('randomstring');

const helpers = require('../app/helpers.js');

const files = {
  default: [
    '.gitignore',
    'gulpfile.js',
    'package.json',
    'readme.md',
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
};

describe('generator-theme', () => {
  describe('should get', () => {
    let gen;

    beforeEach(() => {
      return test
        .run(path.join(__dirname, '../app'))
        .inDir(
          path.join(
            os.tmpdir(),
            `${randomstring.generate(7)}/wp-content/themes/theme-name`
          )
        )
        .withPrompts({
          name: 'Company Name',
          domain: 'company.dev',
          sass: false,
          security: false
        })
        .on('ready', generator => {
          gen = generator;
        });
    });

    it('current directory', () => {
      assert.textEqual(helpers.dir(), 'theme-name');
    });

    describe('answers', () => {
      it('name', () => {
        assert.textEqual(gen.props.name, 'Company Name');
      });

      it('domain', () => {
        assert.textEqual(gen.props.domain, 'company.dev');
      });

      it('sass', () => {
        assert.equal(gen.props.sass, false);
      });

      it('security', () => {
        assert.equal(gen.props.security, false);
      });
    });
  });

  describe('should transform', () => {
    let gen;

    beforeEach(() => {
      return test
        .run(path.join(__dirname, '../app'))
        .inDir(
          path.join(
            os.tmpdir(),
            randomstring.generate(7) + '/wp-content/themes/theme -Name'
          )
        )
        .withPrompts({
          name: 'CoMpany   *name'
        })
        .on('ready', generator => {
          gen = generator;
        });
    });

    it('current directory to name', () => {
      assert.textEqual(helpers.name(), 'Theme Name');
    });

    it('default name to slug', () => {
      assert.textEqual(helpers.nameToSlug(helpers.name()), 'theme-name');
    });

    it('answer name to slug', () => {
      assert.textEqual(gen.props.domain, 'company-name.local');
    });
  });

  describe('should output', () => {
    beforeEach(() => {
      return test
        .run(path.join(__dirname, '../app'))
        .inDir(
          path.join(
            os.tmpdir(),
            `${randomstring.generate(7)}/wp-content/themes/theme-name`
          )
        )
        .withPrompts({
          sass: true,
          security: true
        });
    });

    it('package.json name', () => {
      assert.noJsonFileContent('package.json', {
        name: '<%= props.nameToSlug %>'
      });
      assert.jsonFileContent('package.json', { name: 'theme-name' });
    });

    it('gulpfile.js browser proxy', () => {
      assert.noFileContent('gulpfile.js', /<%=.*%>/);
      assert.fileContent('gulpfile.js', 'theme-name.local');
    });

    it('src/style.scss theme name and description', () => {
      assert.noFileContent('src/style.scss', /<%=.*%>/);
      assert.fileContent('src/style.scss', 'Theme Name');
    });
  });

  describe('should not overwrite existing', () => {
    beforeEach(() => {
      return test
        .run(path.join(__dirname, '../app'))
        .inDir(
          path.join(
            os.tmpdir(),
            `${randomstring.generate(7)}/wp-content/themes/theme-name`
          ),
          dir => {
            fs.writeFileSync(
              path.join(dir + '../../../../wp-config.php'),
              '<?php phpinfo(); ?>'
            );
            fs.writeFileSync(
              path.join(dir + '../../../../.htaccess'),
              'Redirect /old /new'
            );
          }
        )
        .withPrompts({
          sass: true,
          security: true
        });
    });

    it('wp-config.php', () => {
      assert.file('../../../wp-config.php');
      assert.fileContent('../../../wp-config.php', /<\?php.*\?>/);
    });

    it('.htaccess', () => {
      assert.file('../../../.htaccess');
      assert.fileContent('../../../.htaccess', /Redirect/);
    });
  });

  describe('should above theme dir', () => {
    let consoleSpy;

    beforeEach(() => {
      return test
        .run(path.join(__dirname, '../app'))
        .inDir(path.join(os.tmpdir(), '../private'))
        .withPrompts({
          security: true
        })
        .on('ready', generator => {
          // remove existing spy
          generator.log = () => {};

          // attach new spy
          consoleSpy = sinon.spy(generator, 'log');
          generator.log = consoleSpy;
        });
    });

    it('not output security', () => {
      assert.noFile(files.security);
    });

    it('output console log', () => {
      // initializing (1), errors (4), install (1)
      assert.equal(consoleSpy.callCount, 6);
    });
  });

  describe('prompts:', () => {
    describe('all', () => {
      beforeEach(() => {
        return test
          .run(path.join(__dirname, '../app'))
          .inDir(
            path.join(
              os.tmpdir(),
              `${randomstring.generate(7)}/wp-content/themes/theme-name`
            )
          )
          .withPrompts({
            sass: true,
            security: true
          });
      });

      describe('should generate', () => {
        it('default', () => {
          assert.file(files.default);
        });

        it('sass', () => {
          assert.file(files.sass);
        });

        it('security', () => {
          assert.file(files.security);
        });
      });
    });

    describe('sass', () => {
      beforeEach(() => {
        return test
          .run(path.join(__dirname, '../app'))
          .inDir(
            path.join(
              os.tmpdir(),
              `${randomstring.generate(7)}/wp-content/themes/theme-name`
            )
          )
          .withPrompts({
            sass: false
          });
      });

      describe('should generate', () => {
        it('default', () => {
          assert.file(files.default);
        });
      });

      describe('should not generate', () => {
        it('sass', () => {
          assert.noFile(files.sass);
        });
      });
    });

    describe('security', () => {
      beforeEach(() => {
        return test
          .run(path.join(__dirname, '../app'))
          .inDir(
            path.join(
              os.tmpdir(),
              `${randomstring.generate(7)}/wp-content/themes/theme-name`
            )
          )
          .withPrompts({
            security: false
          });
      });

      describe('should generate', () => {
        it('default', () => {
          assert.file(files.default);
        });
      });

      describe('should not generate', () => {
        it('security', () => {
          assert.noFile(files.security);
        });
      });
    });
  });
});
