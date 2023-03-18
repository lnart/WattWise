"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.createUser = void 0;
const client_1 = require("@prisma/client");
const prisma = new client_1.PrismaClient();
async function createUser(user) {
    const createduser = await prisma.user.create({
        data: {
            Firstname: user.Firstname,
            Surname: user.Surname,
            Email: user.Email,
            Password: user.Password,
            Zipcode: user.Zipcode,
            Created_at: user.Created_at,
        }
    });
    console.log(createduser);
}
exports.createUser = createUser;
//# sourceMappingURL=dbController.js.map