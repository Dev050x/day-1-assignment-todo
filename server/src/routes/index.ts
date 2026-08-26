import { Router } from "express";
import { signup, singin } from "../controllers";

const router = Router();

router.get("/sign-up", signup);
router.get("/sign-in", singin);

export default router;