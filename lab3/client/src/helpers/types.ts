// predstavlja treunutno stanje igre, npr. kad se otvori je na start, a kad krenemo igrat se prebacuje na playing
export type GamePhase = "start" | "gameOver" | "playing" | "gameEnd"

// state koji sadrzava trenutno stanje igre, trenutne bodeove i najbolji rezultat
export interface GameState {
    score: number;
    highScore: number;
    phase: GamePhase;
}