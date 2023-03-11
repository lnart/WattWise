"use strict";
exports.__esModule = true;
var express_1 = require("express");
var dotenv_1 = require("dotenv");
(0, dotenv_1.config)();
var app = (0, express_1["default"])();
app.use(express_1["default"].json());
app.use(express_1["default"].urlencoded({ extended: true }));
app.set('views', 'src/views');
app.set('view engine', 'ejs');
app.use('src/public', express_1["default"].static('public'));
app.listen(process.env.PORT, function () {
    console.log("STARTED SERVER ON PORT ".concat(process.env.PORT));
});
