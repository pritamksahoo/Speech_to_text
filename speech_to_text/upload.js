var multer = require('multer');
var path = require('path');
var fs = require('fs');
var extension = "";
var fileName = "";
var ret = [];

exports.uploadArticle = function (fieldname, destination) {
    var storageCriteria = multer.diskStorage({
        destination: function (req, file, cb) {
            cb(null, destination);
        },
        filename: function (req, file, cb) {
            cb(null, file.originalname);
            fileName = file.originalname;
        }
    });

    var uploadCriteria = multer({
        storage: storageCriteria
    });

    var upload = uploadCriteria.fields([{name: fieldname, maxCount: 10}]);

    return upload;

};

exports.name = function () {
    return fileName;
}