import {
    BRICK_ROWS,
    BRICK_COLUMNS,
    BRICK_WIDTH,
    BRICK_HEIGHT,
    BRICK_HORIZONTAL_GAP,
    BRICK_VERTICAL_GAP,
    BRICK_TOP_OFFSET,
    BRICK_SIDE_MARGIN,
    ROW_COLORS,
    MAX_BALL_SPEED,
    CORNER_MULTIPLIER,
    BALL_RADIUS
} from "./constants";

import { draw3DRectangle } from "./renderHelpers";
import type { BallState } from "./ball";
import type { GameState } from "./types";

// struktura koja opisuje ciglu
export interface Brick {
    xPosition: number;
    yPosition: number,
    row: number,
    color: string,
    showing: boolean
}

// funkcija koja vraca novu mrežu cigli
export function newBrickGrid(): Brick[] {
    const bricks: Brick[] = [];

    for (let row = 0; row < BRICK_ROWS; row++) {
        for (let column = 0; column < BRICK_COLUMNS; column++) {
            const xPosition = BRICK_SIDE_MARGIN + column * (BRICK_WIDTH + BRICK_HORIZONTAL_GAP);
            const yPosition = BRICK_TOP_OFFSET + row * (BRICK_HEIGHT + BRICK_VERTICAL_GAP);

            bricks.push({
                xPosition: xPosition,
                yPosition: yPosition,
                row: row,
                color: ROW_COLORS[row],
                showing: true
            });
        }
    }

    return bricks;
}

// iscrtavanje mreže kocka
export function drawBricks(canvasContex: CanvasRenderingContext2D, grid: Brick[]) {
    for (const brick of grid) {
        if (!brick.showing) continue;
        draw3DRectangle(canvasContex, brick.xPosition, brick.yPosition, BRICK_WIDTH, BRICK_HEIGHT, brick.color, 3);
    }
}

// racunanje sudara loptice i kocke
export function handleBrickCollisions(ball: BallState, grid: Brick[], state: GameState): number {
    for (const brick of grid) {
        if (!brick.showing) continue;

        // trazenje najblize tocke na kocki s obzirom na lopticu
        const nearestX = clamp(ball.xPosition, brick.xPosition, brick.xPosition + BRICK_WIDTH);
        const nearestY = clamp(ball.yPosition, brick.yPosition, brick.yPosition + BRICK_HEIGHT);
        const dx = ball.xPosition - nearestX;
        const dy = ball.yPosition - nearestY;
        const distanceSq = dx * dx + dy * dy;

        // ako se dodiruju
        if (distanceSq <= (BALL_RADIUS * BALL_RADIUS)) {
            brick.showing = false;
            state.score += 1;

            // odredivanje normale sudara
            let nx = 0, ny = 0;
            const atLeft = Math.abs(nearestX - brick.xPosition) < 1e-6;
            const atRight = Math.abs(nearestX - (brick.xPosition + BRICK_WIDTH)) < 1e-6;
            const atTop = Math.abs(nearestY - brick.yPosition) < 1e-6;
            const atBottom = Math.abs(nearestY - (brick.yPosition + BRICK_HEIGHT)) < 1e-6;

            // npr. ako je lijevi rub i gore onda znamo da je lijevi kut to
            const cornerHit = (atLeft || atRight) && (atTop || atBottom);

            if (cornerHit) {
                // vektor normale van iz kuta
                const len = Math.sqrt(distanceSq) || 1;
                nx = dx / len;
                ny = dy / len;
            } else if (atLeft) { nx = -1; ny = 0; }
            else if (atRight) { nx = 1; ny = 0; }
            else if (atTop) { nx = 0; ny = -1; }
            else if (atBottom) { nx = 0; ny = 1; }

            // zrcaljene vektora brzine (inverz komponente brzine)
            const dot = ball.xVelocity * nx + ball.yVelocity * ny;
            ball.xVelocity = ball.xVelocity - 2 * dot * nx;
            ball.yVelocity = ball.yVelocity - 2 * dot * ny;

            // promjena pozicije da loptica ne bude u cigli
            const distance = Math.sqrt(distanceSq) || 0;
            const penetration = Math.max(0, BALL_RADIUS - distance) + 0.5;
            ball.xPosition += nx * penetration;
            ball.yPosition += ny * penetration;

            // ako je kut ubrzavamo lopticu
            if (cornerHit) {
                const v = Math.hypot(ball.xVelocity, ball.yVelocity);
                const boosted = Math.min(v * CORNER_MULTIPLIER, MAX_BALL_SPEED);
                // zadržavamo smjer, ali pomnozimo da povecamo
                const speedKoef = boosted / (v || 1);
                ball.xVelocity *= speedKoef;
                ball.yVelocity *= speedKoef;
            }
        }
    }

    return grid.reduce((previus, brick) => previus + (brick.showing ? 1 : 0), 0);
}

// funkcija koja ogranicava vrijednost da je unutar [min, max]
function clamp(value: number, min: number, max: number) {
    return Math.max(min, Math.min(max, value));
}