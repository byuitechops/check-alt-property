/*eslint-env node, es6*/
/*eslint no-console:0*/
/*eslint no-undef:0*/
/*eslint no-unused-vars:0*/

/* Check for the alt properties on images */

const cheerio = require('cheerio'),
    canvas = require('canvas-wrapper');

module.exports = (course, stepCallback) => {
    course.addModuleReport('check-alt-property');
    var $,
        imgsNoAlt = [],
        url = '/api/v1/courses/:' + course.info.courseId + '/pages',
        getPages = canvas.get(url, function (err, pages) {
            if (err) {
                course.throwErr('check-alt-property', err);
                return;
            }
            console.log('pages:', pages)
            return pages;
        });
    var allImages = getPages.map(function (pages) {
            return pages.filter('img');
        }),
        noAlts = allImages.filter(function (image) {
            if (!$('img').hasClass('alt')) {
                console.log('noAlt found!', image)
                imgsNoAlt.concat(image)
            }
        });
    stepCallback(null, course);
    return noAlts;
};
