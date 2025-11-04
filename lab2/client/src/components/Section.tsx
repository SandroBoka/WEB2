import React, { PropsWithChildren } from "react";

type Props = PropsWithChildren<{ 
    title: string,
    subtitle?: string
}>;

export default function Section({ title, subtitle, children }: Props) {
    return (
        <section className="card">
            <h2>{title}</h2>
            {subtitle && <p className="hint">{subtitle}</p>}
            {children}
        </section>
    );
}