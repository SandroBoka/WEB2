import React, { useState } from "react";

type Props = {
    onAdminRequest: () => Promise<any>;
    onFakeAdminRequest: () => Promise<any>;
};

export default function AdminPanel({ onAdminRequest, onFakeAdminRequest }: Props) {
    const [out, setOut] = useState<string>("");
    const [fakeOut, setFakeOut] = useState<string>("");

    return (
        <div style={{ display: "flex", flexDirection: "column", gap: "1rem" }}>
            <div>
                <button
                    onClick={async () => {
                        try {
                            const data = await onAdminRequest();
                            setOut(JSON.stringify(data, null, 2));
                        } catch (e: any) {
                            setOut(`Greška: ${e?.message || String(e)}`);
                        }
                    }}
                >
                    Pozovi /api/admin
                </button>
                {out && (
                    <>
                        <h4>Odgovor /api/admin</h4>
                        <pre className="pre">{out}</pre>
                    </>
                )}
            </div>

            <div>
                <button
                    onClick={async () => {
                        try {
                            const data = await onFakeAdminRequest();
                            setFakeOut(JSON.stringify(data, null, 2));
                        } catch (e: any) {
                            setFakeOut(`Greška: ${e?.message || String(e)}`);
                        }
                    }}
                >
                    Pozovi /api/admin?role=admin
                </button>
                {fakeOut && (
                    <>
                        <h4>Odgovor /api/admin?role=admin</h4>
                        <pre className="pre">{fakeOut}</pre>
                    </>
                )}
            </div>
        </div>
    );
}
