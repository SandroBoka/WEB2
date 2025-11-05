"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.getCurrentUser = getCurrentUser;
const state_1 = require("./state");
function getCurrentUser(req) {
    const username = req.cookies?.username || 'guest';
    let role = "guest";
    if (state_1.state.bacEnabled) {
        // LOSE: vjerujemo klijentu (query string ili cookie)
        const q = req.query.role || req.cookies?.role;
        role = q === "admin" ? "admin" : (q === "user" ? "user" : "guest");
    }
    else {
        // DOBRO: role zakljucujemo na serveru, ignoriramo klijenta
        role = username === "admin" ? "admin" : (username === "alice" ? "user" : "guest");
    }
    return { username, role };
}
