import { tmpdir } from 'os';
import { mkdtempSync } from 'fs';
import { join } from 'path';
import { run } from 'yeoman-test';
import * as assert from 'yeoman-assert';

const files = {
  default: [
    '../../../.gitignore',
    '../../../robots.txt',
    'package.json',
    'postcss.config.js',
    'readme.md',
    'webpack.config.js',
    'src/404.php',
    'src/footer.php',
    'src/functions.php',
    'src/header.php',
    'src/index.php',
    'src/style.scss',
    'src/inc/reset.php',
    'src/inc/scripts.php',
    'src/template-parts/content.php'
  ],
  sass: ['src/_sass/font.scss', 'src/_sass/grid.scss', 'src/_sass/reset.scss'],
  server: ['../../../.htaccess']
};

describe('generator-theme', () => {
  describe('Run location', () => {
    let consoleSpy: jest.SpyInstance;

    beforeEach(() =>
      run(join(__dirname, '../app'), null)
        .inDir(
          join(
            mkdtempSync(join(tmpdir(), 'jest-')),
            '/wp-content/themes/theme-name/src'
          ),
          () => undefined
        )
        .on('ready', generator => (consoleSpy = jest.spyOn(generator, 'log')))
        .catch(_ => undefined));

    it('should not output files if run outside theme folder', () => {
      assert.noFile([...files.default, ...files.sass, ...files.server]);
    });

    it('should output console error if run outside theme folder', () => {
      expect(consoleSpy).toHaveBeenCalledWith(
        expect.stringContaining('theme folder')
      );
    });
  });

  describe('Prompts', () => {
    let generator;

    beforeEach(() =>
      run(join(__dirname, '../app'))
        .inDir(
          join(
            mkdtempSync(join(tmpdir(), 'jest-')),
            '/wp-content/themes/theme-name'
          ),
          () => undefined
        )
        .on('ready', gen => (generator = gen)));

    describe('Name', () => {
      it('should default to humanised dir name', () => {
        expect(generator.answers.name).toBe('Theme Name');
      });
    });

    describe('Server', () => {
      it(`should default to 'Apache'`, () => {
        expect(generator.answers.server).toBe('Apache');
      });
    });

    describe('Sass', () => {
      it('should default to true', () => {
        expect(generator.answers.sass).toBe(true);
      });
    });
  });

  describe('Files', () => {
    describe('Default', () => {
      beforeEach(() => {
        return run(join(__dirname, '../app'))
          .inDir(
            join(
              mkdtempSync(join(tmpdir(), 'jest-')),
              '/wp-content/themes/theme-name'
            ),
            () => undefined
          )
          .withPrompts({
            name: 'Company Name',
            server: 'Other',
            sass: false
          });
      });

      it('should output default', () => {
        assert.file(files.default);
      });

      it('should replace package.json variable', () => {
        assert.noJsonFileContent('package.json', {
          name: '<%= props.nameToSlug %>'
        });
        assert.jsonFileContent('package.json', { name: 'company-name' });
      });

      it('should replace src/style.scss variables', () => {
        assert.noFileContent('src/style.scss', /<%=.*%>/);
        assert.fileContent('src/style.scss', 'Company Name');
      });

      it('should not output server', () => {
        assert.noFile(files.server);
      });

      it('should not output sass', () => {
        assert.noFile(files.sass);
      });
    });

    describe('Server', () => {
      describe('Apache', () => {
        beforeEach(() => {
          return run(join(__dirname, '../app'))
            .inDir(
              join(
                mkdtempSync(join(tmpdir(), 'jest-')),
                '/wp-content/themes/theme-name'
              ),
              () => undefined
            )
            .withPrompts({
              name: 'Company Name',
              server: 'Apache',
              sass: false
            });
        });

        it('should output default', () => {
          assert.file(files.default);
        });

        it('should output server', () => {
          assert.file(files.server);
        });

        it('should not output sass', () => {
          assert.noFile(files.sass);
        });
      });

      describe('Other', () => {
        beforeEach(() => {
          return run(join(__dirname, '../app'))
            .inDir(
              join(
                mkdtempSync(join(tmpdir(), 'jest-')),
                '/wp-content/themes/theme-name'
              ),
              () => undefined
            )
            .withPrompts({
              name: 'Company Name',
              server: 'Other',
              sass: false
            });
        });

        it('should output default', () => {
          assert.file(files.default);
        });

        it('should not output server', () => {
          assert.noFile(files.server);
        });

        it('should not output sass', () => {
          assert.noFile(files.sass);
        });
      });
    });

    describe('Sass', () => {
      beforeEach(() => {
        return run(join(__dirname, '../app'))
          .inDir(
            join(
              mkdtempSync(join(tmpdir(), 'jest-')),
              '/wp-content/themes/theme-name'
            ),
            () => undefined
          )
          .withPrompts({
            name: 'Company Name',
            server: 'Other',
            sass: true
          });
      });

      it('should output default', () => {
        assert.file(files.default);
      });

      it('should output sass', () => {
        assert.file(files.sass);
      });

      it('should output server', () => {
        assert.noFile(files.server);
      });
    });
  });
});
