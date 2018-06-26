import { helpers } from '../app/helpers';

describe('Helpers', () => {
  describe('dirName', () => {
    it('should return name', () => {
      const name = helpers.dirName('/path/to/folder');

      expect(name).toBe('folder');
    });
  });

  describe('humanise', () => {
    it('should return humanised name', () => {
      const name = helpers.humanise('folder -Name');

      expect(name).toBe('Folder Name');
    });
  });

  describe('slugify', () => {
    it('should return slugified name', () => {
      const slug = helpers.slugify('Theme Name');

      expect(slug).toBe('theme-name');
    });
  });
});
