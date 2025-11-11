// Iscrtavanje pravokutnika s 3D sjencanjem
export function draw3DRectangle(
    canvasContex: CanvasRenderingContext2D,
    xPosition: number,
    yPosition: number,
    width: number,
    height: number,
    fillColor: string,
    border: number,
    highlightColor = "rgba(255,255,255,0.95)",
    shadowColor = "rgba(0,0,0,0.65)"
) {
    // unutarnja boja
    canvasContex.fillStyle = fillColor;
    canvasContex.fillRect(xPosition, yPosition, width, height);

    // gornja svijetla strana
    canvasContex.fillStyle = highlightColor;
    canvasContex.fillRect(xPosition, yPosition, width, border);

    // lijeva svijetla strana
    canvasContex.fillRect(xPosition, yPosition, border, height);

    // donja tamna stana
    canvasContex.fillStyle = shadowColor;
    canvasContex.fillRect(xPosition, yPosition + height - border, width, border);

    // desna tamna strana
    canvasContex.fillRect(xPosition + width - border, yPosition, border, height);
}

// iscrtavanje kruga s sjecnanjem
export function draw3DCircle(
    canvasContex: CanvasRenderingContext2D,
    centerX: number,
    centerY: number,
    radius: number,
    fillColor: string
) {
    // sjena
    canvasContex.save();
    canvasContex.shadowColor = "rgba(0,0,0,0.65)";
    canvasContex.shadowBlur = Math.max(6, radius * 1.0);
    canvasContex.shadowOffsetX = 0;
    canvasContex.shadowOffsetY = Math.max(3, radius * 0.55);

    // iscrtavanje kruga s sjenom
    canvasContex.fillStyle = fillColor;
    canvasContex.beginPath();
    canvasContex.arc(centerX, centerY, radius, 0, Math.PI * 2);
    canvasContex.fill();
    canvasContex.restore();

    // iscrtavanje kruga bez sjene
    canvasContex.fillStyle = fillColor;
    canvasContex.beginPath();
    canvasContex.arc(centerX, centerY, radius, 0, Math.PI * 2);
    canvasContex.fill();

    // svijetla gornja i lijeva strana
    const topGradient = canvasContex.createRadialGradient(
        centerX - radius * 0.38, centerY - radius * 0.40, radius * 0.12,
        centerX - radius * 0.38, centerY - radius * 0.40, radius * 0.95
    );
    topGradient.addColorStop(0.00, "rgba(255,255,255,0.95)");
    topGradient.addColorStop(0.35, "rgba(255,255,255,0.35)");
    topGradient.addColorStop(1.00, "rgba(255,255,255,0.0)");
    canvasContex.fillStyle = topGradient;
    canvasContex.beginPath();
    canvasContex.arc(centerX, centerY, radius, 0, Math.PI * 2);
    canvasContex.fill();
    canvasContex.restore();

    // tamna donja i desna strana
    const bottomGradient = canvasContex.createRadialGradient(
        centerX + radius * 0.45, centerY + radius * 0.45, radius * 0.2,
        centerX + radius * 0.45, centerY + radius * 0.45, radius * 1.05
    );
    bottomGradient.addColorStop(0.00, "rgba(0,0,0,0.0)");
    bottomGradient.addColorStop(1.00, "rgba(0,0,0,0.6)");
    canvasContex.fillStyle = bottomGradient;
    canvasContex.beginPath();
    canvasContex.arc(centerX, centerY, radius, 0, Math.PI * 2);
    canvasContex.fill();

    canvasContex.save();
    canvasContex.strokeStyle = "rgba(0,0,0,0.75)";
    canvasContex.lineWidth = Math.max(1, radius * 0.22);
    canvasContex.beginPath();
    canvasContex.arc(centerX + radius * 0.08, centerY + radius * 0.10, radius * 0.90, 0.15 * Math.PI, 0.85 * Math.PI);
    canvasContex.stroke();
    canvasContex.restore();

    // odsjaj
    canvasContex.save();
    canvasContex.fillStyle = "rgba(255,255,255,1)";
    canvasContex.beginPath();
    canvasContex.ellipse(centerX - radius * 0.45, centerY - radius * 0.48, radius * 0.22, radius * 0.12, -0.5, 0, Math.PI * 2);
    canvasContex.fill();
    canvasContex.restore();
}
