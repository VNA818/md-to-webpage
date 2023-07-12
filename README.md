# md-to-webpage
Simple tool to convert Markdown files to webpages with Github styling. Includes code highlighting and auto dark/light mode.

[Example result](https://vna818.github.io/md-to-webpage/)

## Install

`npm install -g <path to folder>`

Ex: `npm install -g C:\Users\vna\Documents\Node\md-to-webpage`

## Usage

In a folder with markdown files run

`md-to-webpage`

### Arguments

| Argument        | Explanation                                                                                              |
|-----------------|----------------------------------------------------------------------------------------------------------|
| -dark           | Only include dark mode styling                                                                           |
| -light          | Only include light mode styling                                                                          |
| --headerprefix= | String to append to header id's default is header- you can link to them by appending #<header id> to url |
| --baseUrl=      | Base url to link all css and image links to default is ./                                                |
| --outputDir=    | Output directory for webpages default is ./output                                                        |

### Dependencies

md-to-webpage relies on some other great projects including:

[marked](https://github.com/markedjs/marked)

[highlight.js](https://github.com/highlightjs/highlight.js)

[html-minifier](https://github.com/kangax/html-minifier)

[github-markdown-css](https://github.com/sindresorhus/github-markdown-css)

