import {
    CANVAS_WIDTH,
    CANVAS_HEIGHT,
    CURRENT_SCORE_POSITION,
    HIGHSCORE_RIGHT_OFFSET,
    HIGHSCORE_TOP_OFFSET,

} from "./constants";

import type { GameState } from "./types";

// ovdje se igra vrti
export function mainGameLoop(canvasContex: CanvasRenderingContext2D, state: GameState) {
    let measuredTime = performance.now();

    // funckija koja se bavi fizikom i logikom kretanja loptice i palice
    function update(timePassed: number) {

    }

    // funkcija koja incrtava po canvasu
    function render() {
        canvasContex.clearRect(0, 0, CANVAS_WIDTH, CANVAS_HEIGHT);
        canvasContex.fillStyle = "#000"; // crna boja zadana u zadatku
        canvasContex.fillRect(0, 0, CANVAS_WIDTH, CANVAS_HEIGHT);

        // trenutni bodovi i najbolji bodovi
        canvasContex.fillStyle = "#fff";
        canvasContex.textBaseline = "top";
        canvasContex.textAlign = "left";
        canvasContex.font = "bold 18px Helvetica, sans-serif";
        canvasContex.fillText(`SCORE: ${state.score}`, CURRENT_SCORE_POSITION.x, CURRENT_SCORE_POSITION.y);

        canvasContex.textAlign = "right";
        canvasContex.fillText(`HIGHSCORE: ${state.highScore}`, CANVAS_WIDTH - HIGHSCORE_RIGHT_OFFSET, HIGHSCORE_TOP_OFFSET);

        // prikazivanje poruka za pojedinu fazu igre
        if (state.phase === "start") {
            drawStartScreen(canvasContex);
        } else if (state.phase === "gameEnd") {
            drawCenteredMessage(canvasContex, "YOU WIN", "yellow");
        } else if (state.phase === "gameOver") {
            drawCenteredMessage(canvasContex, "GAME OVER", "yellow");
        }
    }

    // rekurzivno pozivanje render i frame za iscrtavanje
    function frame(now: number) {
        const timePassed = (now - measuredTime) / 1000;
        measuredTime = now;
        update(timePassed);
        render();
        requestAnimationFrame(frame);
    }

    // prvi poziv
    requestAnimationFrame(frame);
}

// Funkcija koja isctava tekst zadan za pocetak igre
function drawStartScreen(canvasContex: CanvasRenderingContext2D) {
    canvasContex.fillStyle = "#fff";
    canvasContex.textBaseline = "middle";
    canvasContex.textAlign = "center";
    canvasContex.font = "bold 36px Helvetica, sans-serif";

    const centerX = canvasContex.canvas.width / 2;
    const centerY = canvasContex.canvas.height / 2;
    canvasContex.fillText("BREAKOUT", centerX, centerY);

    canvasContex.font = "italic bold 18px Helvetica, sans-serif";
    canvasContex.fillText("Press SPACE to begin", centerX, centerY + 36 + 10);
}

// Funkcija koja iscrtava poruku na sredini canvasa
function drawCenteredMessage(canvasContex: CanvasRenderingContext2D, text: string, color = "yellow") {
    canvasContex.fillStyle = color;
    canvasContex.textBaseline = "middle";
    canvasContex.textAlign = "center";
    canvasContex.font = "bold 40px Helvetica, sans-serif";
    canvasContex.fillText(text, canvasContex.canvas.width / 2, canvasContex.canvas.height / 2);
}