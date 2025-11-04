import express from "express";
import cookieParser from "cookie-parser";
import helmet from "helmet";
import { securityRouter } from "./routes/security"

const app = express();
const PORT = process.env.PORT || 3000;

app.use(express.json());
app.use(express.urlencoded({ extended: false }))
app.use(cookieParser());
app.use(helmet({ contentSecurityPolicy: false }));

app.use(securityRouter)

app.listen(PORT, () => {
    console.log(`API listening on http://localhost:${PORT}`);
});