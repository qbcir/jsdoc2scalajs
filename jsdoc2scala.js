#!/usr/bin/env node

'use strict';
var fs = require('fs');
var tmp = require('tmp');
var parseArgs = require('minimist');
var Handlebars = require('handlebars');
var cp = require('child_process');

var argv = parseArgs(process.argv.slice(2), {});

var jsdocConfPath = argv['jsdocConf'] ? argv['jsdocConf'] : './jsdocConf.json';
var jsdocConf = require(jsdocConfPath);
jsdocConf.opts = {
    "template": argv['template'] || (__dirname + '/template'),
    "encoding": "utf8",
    "destination": argv['dst'],
    "recurse": true,
    "packageName": argv['packageName'] || 'com.example',
    "helpers": ["cocos2d"]
}
var jsdocTmpConfFile = tmp.fileSync();
fs.writeFileSync(jsdocTmpConfFile.name, JSON.stringify(jsdocConf));
var jsdoc_cmd = './node_modules/jsdoc/jsdoc.js  ' + argv['src'] + ' -c ' + jsdocTmpConfFile.name + ' -r ' 
var exit_code = cp.execSync(jsdoc_cmd, {stdio:[0,1,2]});
jsdocTmpConfFile.removeCallback();
process.exit(exit_code);



