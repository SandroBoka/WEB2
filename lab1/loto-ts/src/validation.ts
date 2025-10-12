import { z } from "zod";

const drawScheme = z.object({
    numbers: z.array(z.number().int())
});

export default drawScheme;