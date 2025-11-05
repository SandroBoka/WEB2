"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = __importDefault(require("express"));
const cookie_parser_1 = __importDefault(require("cookie-parser"));
const helmet_1 = __importDefault(require("helmet"));
const path_1 = __importDefault(require("path"));
const security_1 = require("./routes/security");
const app = (0, express_1.default)();
const PORT = Number(process.env.PORT) || 3000;
app.set('trust proxy', 1);
app.use(express_1.default.json());
app.use(express_1.default.urlencoded({ extended: false }));
app.use((0, cookie_parser_1.default)());
app.use((0, helmet_1.default)({ contentSecurityPolicy: false }));
app.use(security_1.securityRouter);
if (process.env.NODE_ENV === "production") {
    const clientDist = path_1.default.resolve(__dirname, "../../client/dist");
    app.use(express_1.default.static(clientDist));
    app.get(/^\/(?!api\/).*/, (_req, res) => {
        res.sendFile(path_1.default.join(clientDist, "index.html"));
    });
}
app.listen(PORT, () => {
    console.log(`API listening on http://localhost:${PORT}`);
});
