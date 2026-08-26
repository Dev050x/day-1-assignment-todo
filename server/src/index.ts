import express from "express";
import "dotenv/config";

const app = express();
const PORT = process.env.PORT || 3000;

app.use(express.json());

app.listen(PORT, () => {
    console.log(`Server is running on ${PORT}`);
});

app.get("/health", (_req, res) =>  {
    return res.json({
        msg: "Server is Healthy",
    });
});
