var assert = require('assert');
var helpers = require('yeoman-test');
var path = require('path');
var assert = require('yeoman-assert');


beforeEach(function () {
  // The object returned acts like a promise, so return it to wait until the process is done
  return helpers.run(path.join(__dirname, '../app'))
  .inDir(path.join(require('os').tmpdir(), 'my-test-folder/dasdas/asdasdas/asdasda/asdas'))
//   .inTmpDir(function (dir) {
//   // `dir` is the path to the new temporary directory
//   // fs.copySync(path.join(__dirname, '../templates/common'), dir)
//   console.log(dir);
// })
    .withPrompts({
      sass: true,
      security: true,
    });
})

describe('Array', function() {
  describe('#indexOf()', function() {
    it('should return -1 when the value is not present', function() {
      assert.equal(-1, [1,2,3].indexOf(4));
    });
  });
});

describe('generator-theme', function () {
  it('generates a project with require.js', function () {
      // assert the file exist
      // assert the file uses AMD definition

      assert.file(path.resolve('../../../wp-config.php'));
      // assert.file('wp-config.php');

  });

  it('generates a project with webpack');
});
