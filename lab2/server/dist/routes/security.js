"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.securityRouter = void 0;
const express_1 = require("express");
const state_1 = require("../state");
const user_1 = require("../user");
const cookies_1 = require("../cookies");
exports.securityRouter = (0, express_1.Router)();
exports.securityRouter.get("/api/health", (_req, res) => {
    res.json({ status: "ok" });
});
exports.securityRouter.get("/api/state", (req, res) => {
    const currentUser = (0, user_1.getCurrentUser)(req);
    res.json({
        xssEnabled: state_1.state.xssEnabled,
        bacEnabled: state_1.state.bacEnabled,
        messages: state_1.state.messages,
        logs: state_1.state.logs,
        currentUser
    });
});
exports.securityRouter.post("/api/toggle", (req, res) => {
    const { xssEnabled, bacEnabled } = req.body ?? {};
    if (typeof xssEnabled === "boolean")
        state_1.state.xssEnabled = xssEnabled;
    if (typeof bacEnabled === "boolean")
        state_1.state.bacEnabled = bacEnabled;
    (0, state_1.log)(`Toggles -> XSS=${state_1.state.xssEnabled ? "ON" : "OFF"}, BAC=${state_1.state.bacEnabled ? "ON" : "OFF"}`);
    res.json({ ok: true, state: { xssEnabled: state_1.state.xssEnabled, bacEnabled: state_1.state.bacEnabled } });
});
function isLikelyXss(input) {
    const s = input.toLowerCase();
    return /<script|onerror=|onload=|javascript:|=alert|<img|<svg|<iframe|<object|href\s*=\s*["']?\s*javascript:/.test(s);
}
exports.securityRouter.post("/api/xss", (req, res) => {
    const msg = (req.body?.message ?? "").toString();
    if (!state_1.state.xssEnabled) {
        if (isLikelyXss(msg)) {
            (0, state_1.log)("Blocked XSS-like payload while XSS is OFF");
            return res.status(400).json({ ok: false, error: "XSS disabled; payload blocked" });
        }
    }
    state_1.state.messages.unshift(msg);
    state_1.state.messages = state_1.state.messages.slice(0, 20);
    (0, state_1.log)(`XSS input stored (vulnerable ON): ${msg}`);
    res.json({ ok: true });
});
exports.securityRouter.post("/api/login", (req, res) => {
    const { username, password } = req.body ?? {};
    let ok = false, role = "guest";
    if (username === "admin" && password === "admin123") {
        ok = true;
        role = "admin";
    }
    else if (username === "TestUser" && password === "test123") {
        ok = true;
        role = "user";
    }
    if (!ok) {
        (0, state_1.log)(`Login failed for ${username}`);
        return res.status(401).json({ error: "Bad credentials" });
    }
    (0, cookies_1.setSessionCookies)(req, res, username, role);
    (0, state_1.log)(`Login ${username} (${role})`);
    res.json({ ok: true });
});
exports.securityRouter.post("/api/logout", (req, res) => {
    res.clearCookie("username");
    res.clearCookie("role");
    (0, state_1.log)("Logout");
    res.json({ ok: true });
});
exports.securityRouter.get("/api/admin", (req, res) => {
    const currentUser = (0, user_1.getCurrentUser)(req);
    const allowed = state_1.state.bacEnabled
        ? (currentUser.role === "admin")
        : (req.cookies?.username === "admin");
    if (!allowed)
        return res.status(403).json({ error: "Forbidden" });
    res.json({
        secret: "This is a very secret message, that is why it is protected!!!",
        message: `Welcome ${currentUser.username}`
    });
});
