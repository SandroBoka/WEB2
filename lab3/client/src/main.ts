import { CANVAS_WIDTH, CANVAS_HEIGHT, HIGHSCORE_KEY } from "./helpers/constants";
import { mainGameLoop } from "./mainGameLoop";
import type { GameState } from "./helpers/types";
import { gameInput } from "./input";

// dohvacanje gameCanvas iz index.html po id i postavljanje sirine i visine kao u zadatku
const gameCanvas = document.getElementById("gameCanvas") as HTMLCanvasElement;
gameCanvas.width = CANVAS_WIDTH;
gameCanvas.height = CANVAS_HEIGHT;

const storedHighScore = Number(localStorage.getItem(HIGHSCORE_KEY) || 0); // ako jos nije spremljeno nista onda 0

const gameState: GameState = {
  score: 0,
  highScore: storedHighScore,
  phase: "start"
}; // pocetni GameState

const input = gameInput(() => {
  if (gameState.phase === "start") {
    gameState.phase = "playing";
  }
});

const canvasContex = gameCanvas.getContext("2d")!;

// pocetak glavne petlje igre
mainGameLoop(canvasContex, gameState, input)