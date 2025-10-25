import { Router } from "express";
import prisma from "../prisma.js";
import { drawScheme } from "../validation.js";
import { requireM2M, requireScope } from "../auth/m2m.js";
import { env } from "../env.js";

export const adminRouter = Router();

adminRouter.use(requireM2M, requireScope(env.M2M_REQUIRED_SCOPE));

adminRouter.post("/new-round", async (_req, res, next) => {
    try {
        await prisma.round.updateMany({
            where: { isActive: true },
            data: { isActive: false }
        });

        await prisma.round.create({
            data: { isActive: true }
        });

        return res.status(204).send();
    } catch (error) {
        next(error);
    }
});

adminRouter.post("/close", async (_req, res, next) => {
    try {
        await prisma.round.updateMany({
            where: { isActive: true },
            data: { isActive: false }
        });

        return res.status(204).send();
    } catch (error) {
        next(error);
    }
});

adminRouter.post("/store-results", async (req, res, next) => {
    try {
        const parsed = drawScheme.safeParse(req.body);
        if (!parsed.success) {
            return res.status(400).json({ error: "Bad Request" });
        }

        const lastRound = await prisma.round.findFirst({
            orderBy: { id: "desc"},
            include: { draw: true}
        });

        if (!lastRound || lastRound.isActive || lastRound.draw) {
            return res.status(400).send("Bad Request");
        }

        await prisma.draw.create ({
            data: {
                numbers: parsed.data.numbers,
                roundId: lastRound.id
            }
        });

        return res.status(204).send();
    } catch (error) {
        next(error);
    }
});