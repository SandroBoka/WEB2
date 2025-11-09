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
