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

userRouter.get("/api/ticket/:code", async (req, res, next) => {
  try {
    const { code } = req.params;

    const ticket = await prisma.ticket.findUnique({
      where: { code },
      include: { round: { include: { draw: true } } }
    });

    if (!ticket) return res.status(404).json({ error: "Ticket not found" });

    return res.json({
      ticket: {
        code: ticket.code,
        numbers: ticket.numbers,
        createdAt: ticket.createdAt
      },
      round: {
        id: ticket.roundId,
        active: ticket.round.isActive,
        createdAt: ticket.round.createdAt,
        drawNumbers: ticket.round.draw?.numbers ?? null,
        drawAt: ticket.round.draw?.createdAt ?? null
      }
    });
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
  res.setHeader("Content-Location", url);
  res.setHeader("X-Ticket-URL", url);
    return res.status(200).send(pngBuffer);
  } catch (err: any) {
    if (err?.name === "ZodError") {
      return res.status(400).json({ error: "Wrong data", details: err.flatten() });
    }
    next(err);
  }
});