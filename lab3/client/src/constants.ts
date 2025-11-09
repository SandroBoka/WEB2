// ovdje su zapisane konstante zadane u teksu labosa

// dimenzije canvasa
export const CANVAS_WIDTH = 900;
export const CANVAS_HEIGHT = 600;

// Polozaj trenutnog broja bodova i maksimalnog broja bodova
export const CURRENT_SCORE_POSITION = { x: 20, y: 20 };
export const HIGHSCORE_RIGHT_OFFSET = 100;
export const HIGHSCORE_TOP_OFFSET = 20;

// 5 redaka i 10 stupaca
export const BRICK_ROWS = 5;
export const BRICK_COLUMNS = 10;

// boje po redovima
export const ROW_COLORS = [
    "rgb(153, 51, 0)",
    "rgb(255, 0, 0)",
    "rgb(255, 153, 204)",
    "rgb(0, 255, 0)",
    "rgb(255, 255, 153)"
];

// pocetna brzina i kut gibanja loptice
export const STARTING_BALL_SPEED = 4;
export const BALL_MOVE_ANGLE = 45;

// LocalStorage kljucevi
export const HIGHSCORE_KEY = "highscore_key";