import {
    CANVAS_WIDTH,
    CANVAS_HEIGHT,
    PADDLE_WIDTH,
    PADDLE_HEIGHT,
    PADDLE_MOVE_SPEED,
    PADDLE_BOTTOM_OFFSET
} from "./constants";

import type { PaddleInputState } from "./input";
import { draw3DRectangle } from "./renderHelpers";

export interface PaddleState {
    xPosition: number;
    yPosition: number;
    paddleWidth: number;
    paddleHeight: number;
    paddleSpeed: number;
}

// vraca novi PaddleState
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
    const paddleColor = "#C8C8C8";

    draw3DRectangle(canvasContex, paddle.xPosition, paddle.yPosition, paddle.paddleWidth, paddle.paddleHeight, paddleColor, 3);
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
