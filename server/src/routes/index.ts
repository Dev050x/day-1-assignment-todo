import { Router } from "express";
import { createTodo, deleteTodo, getTodo, signup, singin, updateTodo } from "../controllers/index";
import { require_auth } from "../utils/auth";

const router = Router();

router.post("/sign-up", signup);
router.post("/sign-in", singin);
router.post("/add", require_auth, createTodo);
router.post("/update", require_auth, updateTodo);
router.delete("/delete", require_auth, deleteTodo);
router.get("/todo", require_auth, getTodo);

export default router;