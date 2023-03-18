"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = require("express");
const dbController_1 = require("../controller/dbController");
const client_1 = require("@prisma/client");
const bcrypt_1 = __importDefault(require("bcrypt"));
const prisma = new client_1.PrismaClient();
let router = (0, express_1.Router)();
router.get('/register', (req, res) => {
    res.render('register', {
        message: false
    });
});
router.post('/register', async (req, res) => {
    if (await (0, dbController_1.findUser)(req.body.email) === null) {
        let salt = await bcrypt_1.default.genSalt();
        let newUser = await (0, dbController_1.createUser)({
            Firstname: req.body.firstname,
            Surname: req.body.surname,
            Email: req.body.email,
            Zipcode: parseFloat(req.body.zipcode),
            Password: await bcrypt_1.default.hash(req.body.password, salt),
            Created_at: new Date()
        });
        res.send('login');
    }
    else {
        res.render('register', {
            message: 'Email Adress is already in use'
        });
    }
});
exports.default = router;
//# sourceMappingURL=loginRoutes.js.map