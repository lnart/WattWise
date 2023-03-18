"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.findUser = exports.createUser = void 0;
const client_1 = require("@prisma/client");
const prisma = new client_1.PrismaClient();
async function createUser(user) {
    const createdUser = await prisma.user.create({
        data: {
            Firstname: user.Firstname,
            Surname: user.Surname,
            Email: user.Email,
            Password: user.Password,
            Zipcode: user.Zipcode,
            Created_at: user.Created_at,
        }
    });
    return createdUser;
}
exports.createUser = createUser;
async function findUser(email) {
    const foundUser = await prisma.user.findFirst({
        where: {
            Email: email
        }
    });
    return foundUser;
}
exports.findUser = findUser;
//# sourceMappingURL=dbController.js.map