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
Object.defineProperty(exports, "__esModule", { value: true });
const vitest_1 = require("vitest");
const weather = __importStar(require("../controller/weatherApiController"));
(0, vitest_1.test)('formats weather data', async () => {
    const result = await weather.formatWeatherData('2023-03-12', '2023-3-13');
    (0, vitest_1.expect)(result).toBeDefined();
    (0, vitest_1.expect)(result).toHaveLength(2);
    (0, vitest_1.expect)(result[0]['datetime']).toBeTypeOf("string");
    (0, vitest_1.expect)(result[0]['tempmax']).toBeTypeOf("number");
    (0, vitest_1.expect)(result[0]['tempmin']).toBeTypeOf("number");
    (0, vitest_1.expect)(result[1]['datetime']).toBeTypeOf("string");
    (0, vitest_1.expect)(result[1]['tempmax']).toBeTypeOf("number");
    (0, vitest_1.expect)(result[1]['tempmin']).toBeTypeOf("number");
});
(0, vitest_1.test)('fetch weather data correctly', async () => {
    const result = await weather.getWeatherData('2023-03-12', '2023-3-13');
    (0, vitest_1.expect)(result).toBeDefined();
    (0, vitest_1.expect)(result).toBeTypeOf('object');
    (0, vitest_1.expect)(result).toHaveProperty('days');
    (0, vitest_1.expect)(result['days']).toHaveLength(2);
});
//# sourceMappingURL=weather.test.js.map