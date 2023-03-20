"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const mqttController_1 = require("./controller/mqttController");
const express_1 = __importDefault(require("express"));
const dotenv_1 = require("dotenv");
const indexRoutes_1 = __importDefault(require("./routes/indexRoutes"));
const loginRoutes_1 = __importDefault(require("./routes/loginRoutes"));
(0, dotenv_1.config)();
const app = (0, express_1.default)();
app.use(express_1.default.json());
app.use(express_1.default.urlencoded({ extended: true }));
app.set('views', 'src/views');
app.set('view engine', 'ejs');
app.use('public', express_1.default.static('./public'));
app.use(indexRoutes_1.default);
app.use(loginRoutes_1.default);
mqttController_1.mqttClient;
app.listen(process.env.PORT, () => {
    console.log(`STARTED SERVER ON PORT ${process.env.PORT}`);
});
//# sourceMappingURL=app.js.map