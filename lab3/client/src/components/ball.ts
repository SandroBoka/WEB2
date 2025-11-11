import {
    CANVAS_WIDTH,
    BALL_RADIUS,
    BALL_SPEED,
    BALL_COLOR
} from "../helpers/constants";

import type { PaddleState } from "./paddle";
import { draw3DCircle } from "../helpers/renderHelpers";

// stanje koje opisuje lopticu
export interface BallState {
    xPosition: number;
    yPosition: number;
    xVelocity: number;
    yVelocity: number;
    isMoving: boolean;
}

// vraca novi (inicijalni) BallState
export function newBall(paddle: PaddleState): BallState {
    return {
        xPosition: paddle.xPosition + paddle.paddleWidth / 2,
        yPosition: paddle.yPosition - BALL_RADIUS - 1,
        xVelocity: 0,
        yVelocity: 0,
        isMoving: false
    }
}

// postavljanje loptice na palicu, pri restartanju igre npr.
export function placeBallOnPaddle(ball: BallState, paddle: PaddleState) {
    ball.xPosition = paddle.xPosition + paddle.paddleWidth / 2;
    ball.yPosition = paddle.yPosition - BALL_RADIUS - 1;
}

// zapocinje kretanje loptice random lijevo ili desno
export function startMovingBall(ball: BallState) {
    if (ball.isMoving) return;

    const direction = Math.random() > 0.5 ? 1 : -1;
    const angle = Math.SQRT1_2; // sin(45) == cos(45)
    ball.xVelocity = direction * BALL_SPEED * angle;
    ball.yVelocity = - BALL_SPEED * angle;
    ball.isMoving = true;
}

// funkcija koja iscrtava lopticu
export function drawBall(canvasContex: CanvasRenderingContext2D, ball: BallState) {
    draw3DCircle(canvasContex, ball.xPosition, ball.yPosition, BALL_RADIUS, BALL_COLOR);
}

// azuriranje pozije loptice
export function updateBallPosition(ball: BallState, timePassed: number) {
    ball.xPosition += ball.xVelocity * timePassed;
    ball.yPosition += ball.yVelocity * timePassed;
}

// racunanje sudara s zidovima
export function handleWallCollison(ball: BallState) {
    // lijevi zid
    if (ball.xPosition - BALL_RADIUS <= 0) {
        ball.xPosition = BALL_RADIUS;
        ball.xVelocity = Math.abs(ball.xVelocity);
    }

    // desni zid
    if (ball.xPosition + BALL_RADIUS >= CANVAS_WIDTH) {
        ball.xPosition = CANVAS_WIDTH - BALL_RADIUS;
        ball.xVelocity = -Math.abs(ball.xVelocity);
    }

    // gorni zid
    if (ball.yPosition - BALL_RADIUS <= 0) {
        ball.yPosition = BALL_RADIUS;
        ball.yVelocity = Math.abs(ball.yVelocity);
    }
}

// racunanje sudara s palicom
export function handlePaddleCollison(ball: BallState, paddle: PaddleState) {
    if (ball.yVelocity <= 0) return;

    const abovePaddle = ball.xPosition >= paddle.xPosition 
        && ball.xPosition <= paddle.xPosition + paddle.paddleWidth;

    const hitY = ball.yPosition + BALL_RADIUS >= paddle.yPosition 
        && ball.yPosition + BALL_RADIUS <= paddle.yPosition + paddle.paddleHeight;

    if (abovePaddle && hitY) {
        // postavljanje loptice da ne ulazi unutar palice
        ball.yPosition = paddle.yPosition - BALL_RADIUS - 0.1;

        // odbijanje ovisno o mjestu udarca loptice u palicu
        const paddleCenter = paddle.xPosition + paddle.paddleWidth / 2;
        const hitOffset = (ball.xPosition - paddleCenter) / (paddle.paddleWidth / 2);
        const bounce = Math.max(-1, Math.min(1, hitOffset));

        // kut skretanja ovisan o mjestu udarca loptice u palicu, maksimalno 60
        const maxAngle = Math.PI / 3;
        const angle = bounce * maxAngle;

        // loptica zadrćava brzinu, ali promjena smjera ovisno o mjestu udarca
        const speed = Math.hypot(ball.xVelocity, ball.yVelocity) || BALL_SPEED;
        ball.xVelocity = speed * Math.sin(angle);
        ball.yVelocity = -Math.abs(speed * Math.cos(angle));
    }
}