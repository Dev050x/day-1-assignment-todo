import express, { type NextFunction, type Request, type Response } from "express";
import "dotenv/config";
import router from "./routes/index.js";
import cors from "cors";

const app = express();
const PORT = process.env.PORT || 8080;

app.use(express.json());
app.use(cors());

app.get("/api/v1/health", (_req: Request, res: Response) => {
    return res.json({
        msg: "Server is Healthy",
    });
});

app.use("/api/v1", router);

app.use((err: unknown, req: Request, res: Response, next: NextFunction) => {
    console.log("unknown err: ", err);
    res.status(500).json({
        msg: "internal server error"
    });
});

if (process.env.NODE_ENV !== "production" && !process.env.VERCEL) {
    app.listen(PORT, () => {
        console.log(`Server is running on ${PORT}`);
    });
}

export default app;
