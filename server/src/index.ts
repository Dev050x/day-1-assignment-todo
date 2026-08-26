import express from "express";
import "dotenv/config";
import router from "./routes";

const app = express();
const PORT = process.env.PORT || 3000;

app.use(express.json());
app.use("/api/v1",router);

app.listen(PORT, () => {
    console.log(`Server is running on ${PORT}`);
});

app.get("/api/v1/health", (_req, res) =>  {
    return res.json({
        msg: "Server is Healthy",
    });
});
