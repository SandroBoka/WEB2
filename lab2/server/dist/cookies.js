"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.setSessionCookies = setSessionCookies;
const state_1 = require("./state");
function isHttps(req) {
    return req.secure || req.headers["x-forwarded-proto"] === "https";
}
function setSessionCookies(req, res, username, role) {
    const opts = state_1.state.xssEnabled
        ? { httpOnly: false, sameSite: "lax" }
        : { httpOnly: true, sameSite: "strict", secure: isHttps(req) };
    res.cookie("username", username, opts);
    res.cookie("role", role, opts);
}
