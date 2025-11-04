import React, { useState } from "react";

type Props = {
    onRequest: () => Promise<any>;
};

export default function AdminPanel({ onRequest }: Props) {
    const [out, setOut] = useState<string>("");

    return (
        <div>
            <button
                onClick={async () => {
                    try {
                        const data = await onRequest();
                        setOut(JSON.stringify(data, null, 2));
                    } catch (e: any) {
                        setOut(`Greška: ${e?.message || String(e)}`);
                    }
                }}
            >
                Pozovi /api/admin
            </button>
            {out && (
                <pre className="pre">{out}</pre>
            )}
        </div>
    );
}
