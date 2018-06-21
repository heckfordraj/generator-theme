const path = require('path');
const s = require('underscore.string');

const helpers = {
  dir: () => path.basename(process.cwd()),
  name: () =>
    s(helpers.dir())
      .humanize()
      .titleize()
      .value(),
  nameToSlug: name =>
    s(name)
      .slugify()
      .value()
};

module.exports = helpers;
