import React from "react";

export default function Logs({ logs }: { logs: string[] }) {
    return (
        <ul className="logs">
            {logs.map((l, i) => (
                <li key={i}>{l}</li>
            ))}
        </ul>
    );
}
