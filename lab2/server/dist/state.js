"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.state = void 0;
exports.log = log;
exports.state = {
    xssEnabled: true,
    bacEnabled: true,
    messages: [],
    logs: []
};
function log(msg) {
    const t = new Date().toISOString();
    exports.state.logs.unshift(`[${t}] ${msg}`);
    exports.state.logs = exports.state.logs.slice(0, 100);
}
