import express, { type NextFunction, type Request, type Response } from "express";
import "dotenv/config";
import router from "./routes";
import cors from "cors";

const app = express();
const PORT = process.env.PORT || 3000;

app.use(express.json());
app.use(cors());
app.use("/api/v1",router);

app.use((err: unknown, req: Request, res: Response, next: NextFunction) => {
    console.log("unknown err: ", err);
    res.status(500).json({
        msg: "internal server error"
    });
});

app.listen(PORT, () => {
    console.log(`Server is running on ${PORT}`);
});

app.get("/api/v1/health", (_req, res) =>  {
    return res.json({
        msg: "Server is Healthy",
    });
});
