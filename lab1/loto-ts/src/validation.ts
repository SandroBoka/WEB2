import { z } from "zod";

export const drawScheme = z.object({
    numbers: z.array(z.number().int())
});

export function parseNumbers(input: string | number[]): number[] {
    let numbers: number[] = [];

    if (Array.isArray(input)) {
        numbers = input.map(Number);
    } else {
        numbers = input
            .split(",")
            .map(s => s.trim())
            .filter(s => s.length > 0)
            .map(Number)
    }

    return numbers;
}

export const ticketInputSchema = z.object({
    documentId: z
        .string()
        .trim()
        .min(1, "Document ID is mandatory")
        .max(20, "Document ID can have max 20 numbers")
        .regex(/^\d+$/, "Document ID can only have numbers"),
    numbers: z.union([
        z.string().min(1, "Numbers are mandatory"),
        z.array(z.number().int())
    ])
}).superRefine((val, ctx) => {
    const arr = parseNumbers(val.numbers as any);

    if (arr.length < 6 || arr.length > 10) {
        ctx.addIssue({ code: "custom", path: ["numbers"], message: "Has to be between 6 and 10 numbers" });
        return;
    }
    if (arr.some(n => !Number.isInteger(n))) {
      ctx.addIssue({ code: "custom", path: ["numbers"], message: "All numbers have to be whole integers" });
    }
    if (arr.some(n => n < 1 || n > 45)) {
      ctx.addIssue({ code: "custom", path: ["numbers"], message: "Numbers have to be between 1 and 45" });
    }
    const numberSet = new Set(arr);
    if (numberSet.size != arr.length) {
      ctx.addIssue({ code: "custom", path: ["numbers"], message: "All numbers have to be unique" });
    }
});