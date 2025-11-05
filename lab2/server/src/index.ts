import express from "express";
import cookieParser from "cookie-parser";
import helmet from "helmet";
import path from "path";
import { securityRouter } from "./routes/security"

const app = express();
const PORT = Number(process.env.PORT) || 3000

app.set('trust proxy', 1);

app.use(express.json());
app.use(express.urlencoded({ extended: false }))
app.use(cookieParser());
app.use(helmet({ contentSecurityPolicy: false }));

app.use(securityRouter)

if (process.env.NODE_ENV === "production") {
  const clientDist = path.resolve(__dirname, "../../client/dist");
  app.use(express.static(clientDist));
  
  app.get(/^\/(?!api\/).*/, (_req, res) => {
    res.sendFile(path.join(clientDist, "index.html"));
  });
}

app.listen(PORT, () => {
    console.log(`API listening on http://localhost:${PORT}`);
});