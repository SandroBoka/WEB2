import { Router } from "express";
import { requireLogin } from "../auth/oidc.js";
import prisma from "../prisma.js";
import { ticketInputSchema, parseNumbers } from "../validation.js";
import QRCode from "qrcode";

export const userRouter = Router();

userRouter.get("/status", async (_req, res, next) => {
    try {
        const currentRound = await prisma.round.findFirst({
            where: {},
            orderBy: { createdAt: "desc" },
            include: {
                _count: { select: { tickets: true } },
                draw: true
            }
        });

        if (!currentRound) {
            return res.json({ round: null });
        }

        const isRoundActive = currentRound.isActive;
        const ticketCount = currentRound._count.tickets;
        const drawNumbers = currentRound.draw?.numbers ?? null;

        res.json({
            round: {
                id: currentRound.id,
                active: isRoundActive,
                ticketCount,
                drawNumbers
            }
        });
    } catch (err) { next(err); }
});

userRouter.get("/ticket/:code", async (req, res, next) => {
  try {
    const { code } = req.params;

    const ticket = await prisma.ticket.findUnique({
      where: { code },
      include: {
        round: {
          include: { draw: true }
        }
      }
    });

    if (!ticket) return res.status(404).send("Ticket not found");

    const drawn = ticket.round.draw?.numbers ?? [];
    const numbers = ticket.numbers;

    res.type("html").send(`
      <html>
        <head><meta charset="utf-8"><title>Ticket ${ticket.code}</title>
          <style>
            body { font-family: system-ui, Arial, sans-serif; padding: 24px; }
            .box { padding:16px; border:1px solid #ddd; border-radius:12px; max-width:560px;}
            .label { color:#666; font-size:12px; text-transform:uppercase; letter-spacing:.06em;}
            .nums { font-size:18px; margin:6px 0 16px; }
            .muted { color:#888 }
          </style>
        </head>
        <body>
          <div class="box">
            <div class="label">Ticket</div>
            <div><strong>Kod:</strong> ${ticket.code}</div>
            <div><strong>Dokument:</strong> ${ticket.documentId}</div>
            <div class="nums"><strong>Numbers:</strong> ${numbers.join(", ")}</div>
            ${drawn.length
              ? `<div class="nums"><strong>Numbers drawn:</strong> ${drawn.join(", ")}</div>`
              : `<div class="muted">Numbers have not been drawn yet for this round.</div>`
            }
          </div>
        </body>
      </html>
    `);
  } catch (err) { next(err); }
});

userRouter.post("/tickets", requireLogin, async (req: any, res, next) => {
  try {
    const parsed = ticketInputSchema.parse(req.body);
    const numbers = parseNumbers(parsed.numbers);

    const activeRound = await prisma.round.findFirst({
      where: { isActive: true },
      orderBy: { createdAt: "desc" }
    });
    if (!activeRound) return res.status(400).json({ error: "Ticket can't be registered because there is no active round " });

    const created = await prisma.ticket.create({
      data: {
        documentId: parsed.documentId,
        numbers,
        roundId: activeRound.id,
      },
      select: { code: true }
    });

    const baseUrl = process.env.AUTH0_BASE_URL || `http://localhost:${process.env.PORT || 3000}`;
    const url = `${baseUrl}/ticket/${created.code}`;

    const pngBuffer: Buffer = await QRCode.toBuffer(url, { type: "png", scale: 6 });

    res.setHeader("Content-Type", "image/png");
    res.setHeader("Cache-Control", "no-store");
    return res.status(200).send(pngBuffer);
  } catch (err: any) {
    if (err?.name === "ZodError") {
      return res.status(400).json({ error: "Wrong data", details: err.flatten() });
    }
    next(err);
  }
});