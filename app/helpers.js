'use strict';
Object.defineProperty(exports, '__esModule', { value: true });
const path_1 = require('path');
const underscore_string_1 = require('underscore.string');
exports.helpers = {
  dirName: path => path_1.basename(path),
  humanise: val =>
    underscore_string_1.titleize(underscore_string_1.humanize(val)),
  slugify: val => underscore_string_1.slugify(val)
};
