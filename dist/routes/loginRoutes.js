"use strict";
var __createBinding = (this && this.__createBinding) || (Object.create ? (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    var desc = Object.getOwnPropertyDescriptor(m, k);
    if (!desc || ("get" in desc ? !m.__esModule : desc.writable || desc.configurable)) {
      desc = { enumerable: true, get: function() { return m[k]; } };
    }
    Object.defineProperty(o, k2, desc);
}) : (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    o[k2] = m[k];
}));
var __setModuleDefault = (this && this.__setModuleDefault) || (Object.create ? (function(o, v) {
    Object.defineProperty(o, "default", { enumerable: true, value: v });
}) : function(o, v) {
    o["default"] = v;
});
var __importStar = (this && this.__importStar) || function (mod) {
    if (mod && mod.__esModule) return mod;
    var result = {};
    if (mod != null) for (var k in mod) if (k !== "default" && Object.prototype.hasOwnProperty.call(mod, k)) __createBinding(result, mod, k);
    __setModuleDefault(result, mod);
    return result;
};
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = require("express");
const dbController_1 = require("../controller/dbController");
const client_1 = require("@prisma/client");
const login = __importStar(require("../controller/loginController"));
const count = __importStar(require("../controller/countController"));
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
        res.render('login', { message: '' });
    }
    else {
        res.render('register', {
            message: 'Email Adress is already in use'
        });
    }
});
router.get('/login', (req, res) => {
    res.render('login', { message: false });
});
router.post('/login', async (req, res) => {
    if (await login.checkIfUserExist(req.body.email) === false) {
        res.render('login', { message: 'Email Doesnt Exist' });
    }
    else if (await login.checkIfUserExist(req.body.email) && await login.compareUserCredentials(req.body.email, req.body.password)) {
        res.render('test', {
            email: req.body.email,
            liveCount: await count.readLiveCount(req.body.email)
        });
    }
    else {
        res.render('login', { message: 'Wrong Password' });
    }
});
exports.default = router;
//# sourceMappingURL=loginRoutes.js.map