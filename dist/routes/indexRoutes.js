"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = require("express");
let router = (0, express_1.Router)();
router.get('/', (req, res) => {
    res.render('test', {
        liveCount: false,
        email: false,
    });
});
exports.default = router;
//# sourceMappingURL=indexRoutes.js.map