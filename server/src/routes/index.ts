import { Router } from "express";
import { signup, singin } from "../controllers";

const router = Router();

router.post("/sign-up", signup);
router.post("/sign-in", singin);

export default router;