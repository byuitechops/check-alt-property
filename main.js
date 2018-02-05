/*eslint-env node, es6*/
/* PostImport file for checking for the alt attributes on images */

const canvas = require('canvas-wrapper'),
    cheerio = require('cheerio'),
    asyncLib = require('async');

module.exports = (course, stepCallback) => {
    var courseId = course.info.canvasOU;

    function beginAPI(callbackOne) {
        canvas.getPages(courseId, function (err, pages) {
            if (err) {
                callbackOne(err, null);
                course.error(err);
            }
            callbackOne(null, pages);
        });
    }

    function checkAlt(pages, callbackTwo) {
        //filter to ids
        var pageIds = pages.map(function (page) {
            return {
                title: page.title,
                id: page.page_id
            };
        });

        function readPages(page, readPagesCb) {
            //foreach id get the page by API
            canvas.get(`/api/v1/courses/${course.info.canvasOU}/pages/${page.id}`, function (err, fullPage) {
                if (err) {
                    readPagesCb(err, null);
                    return;
                }
                //get request wraps page obj in an array, so need to specify in order to get the string itself
                var $ = cheerio.load(fullPage[0].body),
                    images = $('img');
                images.each(function (i, image) {
                    image = $(image);
                    var alt = (image).attr('alt');
                    if (!alt || alt === '') {
                        course.log('Images without alt text', {
                            'filename': `${fullPage[0].title}`,
                            'source': `${image.attr('src')}`
                        });
                    }
                });
                readPagesCb();
            });
        }
        asyncLib.eachLimit(pageIds, 10, readPages, function (err) {
            if (err) {
                callbackTwo(err, null);
                return;
            }
            callbackTwo(null);
        });
    }

    asyncLib.waterfall([beginAPI, checkAlt], function (err) {
        if (err) {
            course.error(err);
        }

        stepCallback(null, course);
    });
};
