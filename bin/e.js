#!/usr/bin/env node

require('commander')
  .version(require('../package').version)
  .usage('<command> [options]')
  .command('count', 'count files and lines in the directory')
  .parse(process.argv)
