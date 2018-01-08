/*eslint-env node, es6*/
/*eslint no-undef:0*/
/*eslint no-unused-vars:0*/

/* Check for the alt properties on images */

const cheerio = require('cheerio'),
    canvas = require('canvas-wrapper');

module.exports = (course, stepCallback) => {
    course.addModuleReport('check-alt-property');
    var $,
        url = '/api/v1/courses/:' + course.info.courseId + '/pages',
        getPages = canvas.get(url, function (err, pages) {
            if (err) {
                course.throwErr('check-alt-property', err);
                return;
            }
            console.log('pages:', pages)
            course.success('check-alt-property', 'successfully retrieved pages');
            return pages;
        });
    /*for each page, read it and look for imgs*/
    var allImages = getPages.map(page) {
        return $('img');
    }
    /*for each image, find imgs without alts*/
    var noAlts = allImages.filter(image) {
        return !$('img').attr('alt')
    }
    stepCallback(null, course);
};
