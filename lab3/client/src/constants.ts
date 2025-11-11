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

// dimenzije kocka
export const BRICK_WIDTH = 50
export const BRICK_HEIGHT = 15;
export const BRICK_HORIZONTAL_GAP = 38;
export const BRICK_VERTICAL_GAP = 15;
export const BRICK_TOP_OFFSET = 90;
export const BRICK_SIDE_MARGIN = 30;  

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

// velicina, brzina i boja loptice
export const BALL_RADIUS = 8;
export const BALL_SPEED = 400;
export const BALL_COLOR = "#EEEEEE";

export const MAX_BALL_SPEED = 900;
export const CORNER_MULTIPLIER = 1.015;

// LocalStorage kljucevi
export const HIGHSCORE_KEY = "highscore_key";

// velicina, brzina, offset i boja palice
export const PADDLE_WIDTH = 120;
export const PADDLE_HEIGHT = 20;
export const PADDLE_MOVE_SPEED = 500;
export const PADDLE_BOTTOM_OFFSET = 30;
export const PADDLE_COLOR = "#C8C8C8";