import express, { Router, type NextFunction } from "express";
import { PDFController } from "./pdfgen/generate-pdf.js";
import { certificationData } from "./pdfgen/const.js";
import path, { dirname } from "path";
import { fileURLToPath } from "url";
import { parseFattura } from "./parser/receipt.js";
import 'dotenv/config';
import { drizzle } from 'drizzle-orm/node-postgres';
import cors from "cors";
import type { Certificato } from "./pdfgen/type/certificate.js";

const db = drizzle(process.env.DATABASE_URL!);

const app = express();

const router = Router();

const corsOption = {
  credentials: true,
  origin: ['http://localhost:3000', 'http://localhost:4200']
}



const controller = new PDFController();

const createCertification = (req: any, res: any, next?: NextFunction) => {
  try {
    console.log(req.body)
    return controller.index(certificationData as unknown as Certificato);
  } catch (error) {
    next?.(error);
  }
  return {};
};


//router.get("/", createCertification);

// Routes
app.use(express.static("images"));

export interface AppError extends Error {
  status?: number;
}

/*const errorHandler = (
  err: AppError,
  req: Request,
  res: Response,
  next: NextFunction
) => {
  console.error(err);
  res.status(err.status || 500).json({
    message: err.message || "Internal Server Error",
  });
};*/

const __filename = fileURLToPath(import.meta.url);
const __dirname = dirname(__filename);

console.log(path.join(__dirname, "/images"));
app.use(express.json());
app.post("/certificato/generate", async (req, res) => {
  createCertification(req, res);
});
app.use("/images", express.static(path.join(__dirname, "/images")));
app.use(cors(corsOption));
app.post("/parseFattura", async (req, res) => {
  const result = await parseFattura();
  console.log(result);
  res.send(result);
});
//app.use(errorHandler);

interface Config {
  port: number;
  nodeEnv: string;
}

const config: Config = {
  port: Number(process.env.PORT) || 3000,
  nodeEnv: process.env.NODE_ENV || "development",
};

app.listen(config.port, () => {
  console.log(`Server running on port ${config.port}`);
});
