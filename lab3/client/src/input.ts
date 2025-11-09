// predstavlja trenutno stanje ulaza s tipkovnice za palicu
export interface PaddleInputState {
    left: boolean;
    right: boolean;
}

// funckija koja prima callback za pocetak igre, a vraca input koji se azurira pri svakom pritisku i cleanp funkciju
// koja mice eventListenere
export function gameInput(onStart: () => void): { input: PaddleInputState; cleanup: () => void } {
    const input: PaddleInputState = { left: false, right: false };

    const keydown = (event: KeyboardEvent) => {
        if (event.code === "Space") onStart();
        if (event.code === "ArrowLeft" || event.code === "KeyA") input.left = true;
        if (event.code === "ArrowRight" || event.code === "KeyD") input.right = true;
    };

    const keyup = (event: KeyboardEvent) => {
        if (event.code === "ArrowLeft" || event.code === "KeyA") input.left = false;
        if (event.code === "ArrowRight" || event.code === "KeyD") input.right = false;
    };

    window.addEventListener("keydown", keydown);
    window.addEventListener("keyup", keyup);

    const cleanup = () => {
        window.removeEventListener("keydown", keydown);
        window.removeEventListener("keyup", keyup);
    };

    return { input, cleanup };
}