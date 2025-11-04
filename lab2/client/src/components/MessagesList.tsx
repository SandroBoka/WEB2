import React from "react";

type Props = {
    messages: string[];
    xssEnabled: boolean;
};

export default function MessagesList({ messages, xssEnabled }: Props) {
    return (
        <ul className="messages">
            {messages.map((m, i) => (
                <li key={i}>
                    {xssEnabled ? (
                        <span dangerouslySetInnerHTML={{ __html: m }} />
                    ) : (
                        <span>{m}</span>
                    )}
                </li>
            ))}
        </ul>
    );
}
