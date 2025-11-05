import React from "react";

export type FlashKind = "info" | "success" | "warn" | "error";
export type FlashMessage = { kind: FlashKind; text: string };
export type Flash = FlashMessage | null;

export default function FlashBanner({ flash, onClose }: { flash: Flash; onClose: () => void }) {
    if (!flash) return null;
    return (
        <div className={`flash flash-${flash.kind}`}>
            <span>{flash.text}</span>
            <button type="button" onClick={onClose} aria-label="Zatvori">×</button>
        </div>
    );
}
