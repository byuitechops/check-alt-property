/*eslint-env node, es6*/
/*eslint no-console:0*/
/*eslint no-undef:0*/
/*eslint no-unused-vars:0*/
/* PREIMPORT Check for the alt attributes on images */

module.exports = (course, stepCallback) => {
    course.addModuleReport('check-alt-property');
    var pages = course.content,
        noAltImages = [];
    pages.filter(function (page) {
        return (page.ext === '.html');
    });
    pages.forEach(function (page, index) {
        var $ = page.dom;
        $('html body img').each(function (i, elem) {
            if (!$(elem).attr('alt')) {
                noAltImages.push({
                    course: course.info.D2LOU,
                    filename: page.name,
                    image: $(elem).attr('src')
                });
            }
        });
    });

    course.success('check-alt-property', 'retrieved images with no alt attribute');
    console.log('no-alt-images', noAltImages);
    course.newInfo('no-alt-images', noAltImages);
    stepCallback(null, course);
};
