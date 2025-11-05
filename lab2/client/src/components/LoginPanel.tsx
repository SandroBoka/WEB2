import React, { useState } from "react";

type Props = {
    onLogin: (username: string, password: string) => Promise<void>;
    onLogout: () => Promise<void>;
    currentUser: { username: string; role: "guest" | "user" | "admin" };
};

export default function LoginPanel({ onLogin, onLogout, currentUser }: Props) {
    const [username, setUsername] = useState("");
    const [password, setPassword] = useState("");

    const loggedIn = currentUser.username !== "guest";

    return (
        <>
            <p>
                Status:&nbsp;
                <span className={`badge ${loggedIn ? "badge-ok" : "badge-off"}`}>
                    {loggedIn ? "Prijavljen" : "Odjavljen"}
                </span>
                &nbsp;— korisnik: <strong>{currentUser.username}</strong> (rola: <strong>{currentUser.role}</strong>)
            </p>

            <form
                className="inline"
                onSubmit={async e => {
                    e.preventDefault();
                    await onLogin(username, password);
                    setPassword("");
                }}
            >
                <label>
                    Korisničko ime:
                    <input
                        value={username}
                        onChange={e => setUsername(e.target.value)}
                        placeholder="admin ili TestUser"
                        required
                    />
                </label>
                <label>
                    Lozinka:
                    <input
                        value={password}
                        onChange={e => setPassword(e.target.value)}
                        placeholder="admin123 ili test123"
                        required
                        type="password"
                    />
                </label>
                <button type="submit">Prijava</button>
                {loggedIn && (
                    <button type="button" onClick={onLogout} style={{ marginLeft: ".5rem" }}>
                        Odjava
                    </button>
                )}
            </form>
        </>
    );
}
