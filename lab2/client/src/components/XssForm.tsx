import React, { useState } from "react";

type Props = { onSubmit: (message: string) => Promise<void> };

export default function XssForm({ onSubmit }: Props) {
    const [message, setMessage] = useState("");

    return (
        <form
            onSubmit={async e => {
                e.preventDefault();
                if (!message.trim()) return;
                await onSubmit(message);
                setMessage("");
            }}
        >
            <label>
                Poruka:
                <input
                    value={message}
                    onChange={e => setMessage(e.target.value)}
                    placeholder="npr. <img src=x onerror=alert(document.cookie)>"
                />
            </label>
            <button type="submit">Pošalji</button>
        </form>
    );
}
