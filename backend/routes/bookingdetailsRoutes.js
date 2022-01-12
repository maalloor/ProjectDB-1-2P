var express = require('express');
var router = express.Router();

const controller = require("../controller/bookingdetails.controller");

router.get('/', controller.findAll);
router.get('/:id', controller.findOne);
router.post('/', controller.new);
router.put('/:id', controller.update);
//router.delete('/:id', controller.delete);

module.exports = router;