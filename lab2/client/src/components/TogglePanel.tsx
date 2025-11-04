import React, { useState, useEffect } from "react";

type Props = {
    xssEnabled: boolean;
    bacEnabled: boolean;
    onApply: (next: { xssEnabled: boolean; bacEnabled: boolean }) => Promise<void>;
}

export default function TogglePanel({ xssEnabled, bacEnabled, onApply }: Props) {
    const [xss, setXss] = useState(xssEnabled);
    const [bac, setBac] = useState(bacEnabled);

    useEffect(() => setXss(xssEnabled), [xssEnabled]);
    useEffect(() => setBac(bacEnabled), [bacEnabled]);

    return (
        <div className="toggles">
            <label>
                <input type="checkbox" checked={xss} onChange={e => setXss(e.target.checked)} />
                XSS ranjivost uključena
            </label>
            <br />
            <label>
                <input type="checkbox" checked={bac} onChange={e => setBac(e.target.checked)} />
                Broken Access Control uključena
            </label>
            <br />
            <button onClick={() => onApply({ xssEnabled: xss, bacEnabled: bac })}>Spremi</button>
        </div>
    );

}