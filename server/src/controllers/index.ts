import type { Request, Response } from "express";
import { CreteTodoSchema, deleteTodoSchema, UpdateTodoSchema, UserAuthSchema } from "../schema";
import { sendValidationError } from "../utils/zod-validation";
import { prisma } from "../lib/db";
import { create_token } from "../utils/auth";
import bcrypt from "bcrypt";

export async function signup(req: Request, res: Response) {
    const body = UserAuthSchema.safeParse(req.body);

    if(!body.success){
        return sendValidationError(res, body.error);
    }

    const password = await bcrypt.hash(body.data.password, 10);

    try {
        const user = await prisma.user.create({
            data: {
                username: body.data.username,
                password
            }
        });
    
        return res.status(200).json({
            msg: "user creted succefully",
            userId: user.id
        });
        
    } catch (error) {
        return res.status(400).json({
            msg: "user already exist",
            error: error
        });
    }

}

export async function singin(req: Request, res: Response) {
    const body = UserAuthSchema.safeParse(req.body);

    if(!body.success){
        return sendValidationError(res, body.error);
    }

    const user = await prisma.user.findUnique({
        where: {
            username: body.data.username
        }
    });

    if(!user) {
        return res.status(400).json({
            msg: "user does not exist"
        });
    };

    const isMatch = await bcrypt.compare(body.data.password, user.password);

    if(!isMatch) {
        return res.status(400).json({
            msg: "password incorrect"
        })
    }

    const token = create_token(user.id);

    return res.status(200).json({
        msg: "user loggedin succefully",
        token
    });
}

export async function createTodo(req: Request, res: Response) {
    const body = CreteTodoSchema.safeParse(req.body);
    const userId = req.userId!;
    if(!body.success) {
        return sendValidationError(res, body.error);
    }

    const todo = await prisma.todo.create({
        data: {
            name: body.data.name,
            userId: userId
        }
    });

    return res.status(200).json({
        msg: "todo created succefully",
        todo: todo,
    })
}

export async function updateTodo(req: Request, res: Response) {
    const body = UpdateTodoSchema.safeParse(req.body);
    if(!body.success) {
        return res.status(400).json({
            msg: "Please Provide Valid request schema"
        });
    };
    const todo = await prisma.todo.update({
        where: {
            id: body.data.id
        },
        data: {
            done: true
        }
    });

    return res.status(200).json({
        msg: "Todo updated succefully",
        todo: todo,
    });
}

export async function getTodo(req: Request, res: Response) {
    const userId = req.userId;

    const todos = await prisma.todo.findMany({
        where: {
            userId: userId
        }
    });

    return res.status(200).json({
        todos
    });
}

export async function deleteTodo(req: Request, res: Response) {
    const userId = req.userId;
    const body = deleteTodoSchema.safeParse(req.body);
    if(!body.success) {
        return sendValidationError(res, body.error);
    }

    const todo = await prisma.todo.update({
        where: {
            id: body.data.id,
            userId: userId
        },
        data: {
            deleted: true,
        }
    });

    return res.status(200).json({
        msg: "todo deleted succefully",
        todo
    });
}