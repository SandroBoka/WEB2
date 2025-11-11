import {
    CANVAS_WIDTH,
    CANVAS_HEIGHT,
    PADDLE_WIDTH,
    PADDLE_HEIGHT,
    PADDLE_MOVE_SPEED,
    PADDLE_BOTTOM_OFFSET,
    PADDLE_COLOR
} from "../helpers/constants";

import type { PaddleInputState } from "../input";
import { draw3DRectangle } from "../helpers/renderHelpers";

// stanje koje opisuje palicu
export interface PaddleState {
    xPosition: number;
    yPosition: number;
    paddleWidth: number;
    paddleHeight: number;
    paddleSpeed: number;
}

// vraca novi (inicijalni) PaddleState
export function newPaddle(): PaddleState {
    return {
        xPosition: (CANVAS_WIDTH - PADDLE_WIDTH) / 2,
        yPosition: CANVAS_HEIGHT - PADDLE_HEIGHT - PADDLE_BOTTOM_OFFSET,
        paddleWidth: PADDLE_WIDTH,
        paddleHeight: PADDLE_HEIGHT,
        paddleSpeed: PADDLE_MOVE_SPEED
    }
}

// funkcija koja iscrtava pailicu
export function drawPaddle(canvasContex: CanvasRenderingContext2D, paddle: PaddleState) {
    draw3DRectangle(canvasContex, paddle.xPosition, paddle.yPosition, paddle.paddleWidth, paddle.paddleHeight, PADDLE_COLOR, 3);
}

// azuriranje pozicije palice
export function updatePaddlePosition(paddle: PaddleState, input: PaddleInputState, timePassed: number) {
    const moveDirection = (input.right ? 1 : 0) - (input.left ? 1 : 0);
    paddle.xPosition += moveDirection * paddle.paddleSpeed * timePassed;

    // palica ne smije izaci van rubova canvasa
    if (paddle.xPosition < 0) {
        paddle.xPosition = 0;
    }
    if (paddle.xPosition > CANVAS_WIDTH - paddle.paddleWidth) {
        paddle.xPosition = CANVAS_WIDTH - paddle.paddleWidth;
    }
}
