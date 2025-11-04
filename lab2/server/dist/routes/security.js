"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.securityRouter = void 0;
const express_1 = require("express");
const state_1 = require("../state");
const user_1 = require("../user");
const cookies_1 = require("../cookies");
exports.securityRouter = (0, express_1.Router)();
// Pomoćna: health (ostaje ti i tvoj /api/health)
exports.securityRouter.get('/api/health', (_req, res) => {
    res.json({ status: 'ok' });
});
// Pročitaj trenutno stanje (za frontend)
exports.securityRouter.get('/api/state', (req, res) => {
    const me = (0, user_1.getCurrentUser)(req);
    res.json({
        xssEnabled: state_1.state.xssEnabled,
        bacEnabled: state_1.state.bacEnabled,
        messages: state_1.state.messages,
        logs: state_1.state.logs,
        me
    });
});
// Uključi/isključi ranjivosti
exports.securityRouter.post('/api/toggle', (req, res) => {
    const { xssEnabled, bacEnabled } = req.body ?? {};
    if (typeof xssEnabled === 'boolean')
        state_1.state.xssEnabled = xssEnabled;
    if (typeof bacEnabled === 'boolean')
        state_1.state.bacEnabled = bacEnabled;
    (0, state_1.log)(`Toggles -> XSS=${state_1.state.xssEnabled ? 'ON' : 'OFF'}, BAC=${state_1.state.bacEnabled ? 'ON' : 'OFF'}`);
    res.json({ ok: true, state: { xssEnabled: state_1.state.xssEnabled, bacEnabled: state_1.state.bacEnabled } });
});
// XSS: spremi poruku (kasnije će se renderirati escaped/ne-escaped u Reactu)
exports.securityRouter.post('/api/xss', (req, res) => {
    const msg = (req.body?.message ?? '').toString();
    state_1.state.messages.unshift(msg);
    state_1.state.messages = state_1.state.messages.slice(0, 12);
    (0, state_1.log)(`XSS input: ${msg}`);
    res.json({ ok: true });
});
// Demo login
exports.securityRouter.post('/api/login', (req, res) => {
    const { username, password } = req.body ?? {};
    let ok = false, role = 'guest';
    if (username === 'admin' && password === 'admin123') {
        ok = true;
        role = 'admin';
    }
    else if (username === 'alice' && password === 'alice123') {
        ok = true;
        role = 'user';
    }
    if (!ok) {
        (0, state_1.log)(`Login failed for ${username}`);
        return res.status(401).json({ error: 'Bad credentials' });
    }
    (0, cookies_1.setSessionCookies)(req, res, username, role);
    (0, state_1.log)(`Login ${username} (${role})`);
    res.json({ ok: true });
});
// Admin endpoint
// RANJIVO (bacEnabled=TRUE): admin pristup ako role=admin dođe iz query stringa ili cookie
// SIGURNIJE (bacEnabled=FALSE): admin je SAMO stvarno ulogirani 'admin'
exports.securityRouter.get('/api/admin', (req, res) => {
    const me = (0, user_1.getCurrentUser)(req);
    const allowed = state_1.state.bacEnabled
        ? (me.role === 'admin') // RANJIVO: role iz klijenta
        : (req.cookies?.username === 'admin'); // SIGURNIJE: provjera stvarnog identiteta
    if (!allowed)
        return res.status(403).json({ error: 'Forbidden' });
    res.json({
        secret: 'very-secret-demo',
        message: `Welcome ${me.username}`
    });
});
