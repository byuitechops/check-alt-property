/*eslint-env node, es6*/
/*eslint no-console:0*/
/*eslint no-undef:0*/
/*eslint no-unused-vars:0*/
/* PostImport file for checking for the alt attributes on images */

const canvas = require('canvas-wrapper'),
    cheerio = require('cheerio'),
    asyncLib = require('async'),
    fs = require('fs'),
    dsv = require('d3-dsv'),
    pathLib = require('path'),
    csvToTable = require('csv-to-table');

module.exports = (course, stepCallback) => {
    courseId = course.info.canvasOU;

    function beginAPI(callbackOne) {
        canvas.getPages(courseId, function (err, pages) {
            if (err) {
                callbackOne(err, null);
                course.throwErr(err);
            }
            callbackOne(null, pages);
        });
    }

    function checkAlt(pages, callbackTwo) {
        var noAltImages = [],
            //filter to ids
            pageIds = pages.map(function (page) {
                return page.page_id;
            });

        function readPages(id, readPagesCb) {
            //foreach id get the page by API
            canvas.get(`/api/v1/courses/${course.info.canvasOU}/pages/${id}`, function (err, page) {
                if (err) {
                    readPagesCb(err, null)
                    return;
                }
                //get request wraps page obj in an array, so need to specify in order to get the string itself
                var $ = cheerio.load(page[0].body),
                    images = $('img');
                images.each(function (i, image) {
                    image = $(image);
                    console.log('IMAGE FILE', image.title)
                    if (!(image).attr('alt')) {
                        noAltImages.push({
                            canvasId: course.info.canvasOU,
                            source: image.attr('src')
                        });
                    }
                });
                readPagesCb()
            });
        }
        asyncLib.each(pageIds, readPages, function (err, images) {
            callbackTwo(null, noAltImages);
        });
    }

    asyncLib.waterfall([beginAPI, checkAlt], function (err, result) {
        if (err) {
            course.throwErr('check-alt-property', err)
        }
        stepCallback(null, course);
    })
    //write a csv of noAltImages
    /*var fileName = 'Missing-Alt-Text',
    path = pathLib.resolve('.', 'noAltImages');
fs.mkdirSync(path);
var newPath = pathLib.resolve(path, '\\' + fileName),
    columns = ['Canvas Id', 'Image'],
    finalImages = dsv.csvFormat(noAltImages, columns);
fs.writeFileSync(fileName + '.csv', finalImages);
csvToTable.fromArray(noAltImages, columns, false, true, fileName)*/
};
