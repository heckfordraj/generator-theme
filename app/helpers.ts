import { basename } from 'path';
import { slugify, humanize, titleize } from 'underscore.string';

export const helpers = {
  dirName: (path: string): string => basename(path),
  humanise: (val: string): string => titleize(humanize(val)),
  slugify: (val: string): string => slugify(val)
};
