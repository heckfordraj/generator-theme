const path = require('path');
const s = require('underscore.string');

const helpers = {

  dir: function() {

    return path.basename(process.cwd());
  },

  name: function() {

    return s(helpers.dir()).humanize().titleize().value();
  },

  nameToSlug: function(name) {

    return s(name).slugify().value();
  }
};

module.exports = helpers;
