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
exports.compareUserCredentials = exports.checkIfUserExist = void 0;
const db = __importStar(require("../controller/dbController"));
const bcrypt_1 = __importDefault(require("bcrypt"));
async function checkIfUserExist(email) {
    if (await db.findUser(email)) {
        return true;
    }
    else {
        return false;
    }
}
exports.checkIfUserExist = checkIfUserExist;
async function compareUserCredentials(email, password) {
    const user = await db.findUser(email);
    const hashedPassword = user === null || user === void 0 ? void 0 : user.Password;
    //@ts-ignore
    const match = await bcrypt_1.default.compare(password, hashedPassword);
    if (match)
        return true;
    return false;
}
exports.compareUserCredentials = compareUserCredentials;
//# sourceMappingURL=loginController.js.map