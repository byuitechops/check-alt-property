# Check Alt Property
### Package Name: check-alt-property
### Child Type: post import
### Platform: all
### Required: Recommended
This child module is built to be used by the Brigham Young University - Idaho D2L to Canvas Conversion Tool. It utilizes the standard module.exports => (course, stepCallback) signature and uses the Conversion Tool's standard logging functions. You can view extended documentation Here.

## Purpose
Check alternative text properties from html pages in canvas to generate a report for another team to manually fix.

## How to Install
npm install check-alt-property
Run inside of the d2l-to-canvas-conversion-tool

## Outputs
course.log's all images that do not have an alt text property

| Option | Type | Location |
|--------|--------|-------------|
|Page| String | course.log|
|Quiz| String | course.log|
|Quiz Question| String | course.log|

## Process
Describe in steps how the module accomplishes its goals.

1. uses `canvas-wrapper` to pull down the pages (eventually will also get quizzes & quiz questions)
2. parses the page using cheerio
3. searches where the alt tag is nonexistent or empty
4. Logs all found images without alt text to the course object.

## Log Categories
Pages searched
(Eventually): Quiz and quiz questions searched

## Requirements
Module is expected to find images in the course that are missing alt text in order to later fix that problem and meet ADA requirements for the University LMS.