"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = require("express");
const express_2 = __importDefault(require("express"));
const router = (0, express_1.Router)();
router.use('/public', express_2.default.static('public'));
router.get('/', (req, res) => {
    res.render('test', {
        liveCount: false,
        email: false,
    });
});
exports.default = router;
//# sourceMappingURL=indexRoutes.js.map