#!/usr/bin/env node

const path = require('path');
const fs = require('fs');
const markdown  = require('marked');
const markedHighlight = require('marked-highlight').markedHighlight;
const mangle = require('marked-mangle').mangle;
const hljs = require('highlight.js');
const markedBaseUrl = require('marked-base-url');
const headers = require('marked-gfm-heading-id').gfmHeadingId;
const minify = require('html-minifier').minify;

let colorMode = '';
let baseUrl = './';
const directoryPath = process.cwd();
let outputDir = './output';
let headerPrefix = 'header-';

process.argv.slice(2).forEach((arg, i) => {
  if(arg === '-dark') {
    colorMode = arg;
  }
  if(arg === '-light') {
    colorMode = arg;
  }
  let argUrl1 = arg.split('--baseUrl=');
  baseUrl = argUrl1[1] || baseUrl;
  let argUrl2 = arg.split('--headerPrefix=');
  headerPrefix = argUrl2[1] || headerPrefix;
  let argUrl3 = arg.split('--outputDir=');
  outputDir = argUrl3[1] || outputDir;
});

const html = (body, options) =>
`<!DOCTYPE html>
<html lang="en"${options.colorMode !== '' ? ` class="${options.colorMode}"` : ''}>
  <head>
    <meta charset="utf-8" />
    <link rel="icon" href="${options.path}favicon.ico" />
    <meta name="viewport" content="width=device-width, initial-scale=1" />
    <link rel="stylesheet" href="${options.path}github-markdown${options.colorMode}.css">
    <link rel="stylesheet" href="${options.path}mdStyle.css">
    ${options.code ? `<link rel="stylesheet" href="${options.path}mdCode${options.colorMode}.css">` : ''}
    <title>${options.title.charAt(0).toUpperCase() + options.title.slice(1)}</title>
  </head>
  <body>
    <div class="mdContainer markdown-body">
      <div class='markdown-body mdContent'>
        ${body}
      </div>
      <div class='mdFooter'>
        Made With: <a href='https://github.com/VNA818/md-to-webpage'>md to webpage</a>
      </div>
    </div>
  </body>`;

fs.readdir(directoryPath, (err, files) => {
  if (err) {
    return console.log('Unable to scan directory: ' + err);
  } 
  
  const fileList = files.filter(file => path.extname(file).toLowerCase() === '.md');

  if(fileList.length === 0) {
    return console.log('No .md files found');
  } else {
    markdown.use(markedHighlight({
      langPrefix: 'hljs language-',
      highlight(code, lang) {
        includeCode = {currentFile: true, inDirectory: true};
        const language = hljs.getLanguage(lang) ? lang : 'plaintext';
        return hljs.highlight(code, { language }).value;
      }
    }));
    markdown.use(mangle());
    markdown.use(headers({ prefix: headerPrefix }));
    if(baseUrl !== './') {
      markdown.use(markedBaseUrl.baseUrl(baseUrl));
    }
  }

  let num = 0;
  let includeCode = { currentFile: false, inDirectory: false };

  fileList.forEach((file) => {
    includeCode.currentFile = false;
    const title = file.replace('.md', '').replace('.MD', '');
    file = fs.readFileSync(file, 'utf-8');
    const body = markdown.parse(file);

    let page = html(body, {
      title: title,
      path: baseUrl,
      colorMode: colorMode,
      code: includeCode.currentFile
    })
    page = minify(page, { collapseWhitespace: true });

    if(!fs.existsSync(path.join(directoryPath, `${outputDir}`))){
      fs.mkdirSync(path.join(directoryPath, `${outputDir}`));
    }

    fs.writeFileSync(path.join(directoryPath, `${outputDir}/${title}.html`), page);
    console.log(`Converted ${title}.md to ${title}.html in ${outputDir}`);
    num++;
  });

  if(num > 0) {
    fs.copyFileSync(path.join(__dirname, `./styles/github-markdown${colorMode}.css`), path.join(directoryPath, `${outputDir}/github-markdown${colorMode}.css`));
    if(includeCode.inDirectory) {
      fs.copyFileSync(path.join(__dirname, `./styles/mdCode${colorMode}.css`), path.join(directoryPath, `${outputDir}/mdCode${colorMode}.css`));
    }
      fs.copyFileSync(path.join(__dirname, `./styles/mdStyle.css`), path.join(directoryPath, `${outputDir}/mdStyle.css`));
    console.log(`Converted ${num} file${num.length !== 1 ? 's' : ''}`);
  }
});