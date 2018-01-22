/*eslint-env node, es6*/
/*eslint no-console:0*/
/*eslint no-undef:0*/
/*eslint no-unused-vars:0*/
/* PostImport file for checking for the alt attributes on images */

const canvas = require('canvas-wrapper'),
    cheerio = require('cheerio'),
    async = require('async'),
    fs = require('fs'),
    dsv = require('d3-dsv'),
    csvToTable = require('csv-to-table');

module.exports = (course, stepCallback) => {
    course.addModuleReport('check-alt-property');
    var noAltImages = [],
        courseId = course.info.canvasOU;

    function beginAPI(callbackOne) {
        var allPages = canvas.getPages(courseId, function (err, pages) {
            if (err) {
                callbackOne(err, null);
                course.throwErr(err);
            }
            console.log('ALL PAGES', allPages)
            callbackOne(null, pages);
        });
    }

    function checkAlt(pages, callbackTwo) {
        pages.forEach(function (page, i) {
            canvas.get(`/api/v1/courses/${course.info.canvasOU}/pages`, function (err, fullPage) {
                var $ = cheerio.load(fullPage.body),
                    images = $('html body img');
                images.each(function (i, image) {
                    if (!(image).attr('alt')) {
                        noAltImages.push({
                            course: course.info.canvasOU,
                            filename: fullPage.title,
                            image: (image).attr('src')
                        });
                    }
                    callbackTwo(null, noAltImages)
                });
            });
        });
        console.log('IMAGES:', noAltImages)
    }

    async.waterfall([beginAPI, checkAlt], function (err, result) {
        if (err) {
            course.throwErr('check-alt-property', err)
        }
    })
    //write a csv of noAltImages
    /*var fileName = 'Pages w/images missing alt text',
    columns = ['Canvas Id', 'Page', 'Image'],
    finalPages = dsv.csvFormat(noAltImages.course, noAltImages.filename, noAltImages.image, columns);
fs.writeFileSync(filename + '.csv', finalPages);
csvToTable.fromArray(null)
course.success('check-alt-property', 'wrote file for Images with no alt text');*/

    stepCallback(null, course);
};
