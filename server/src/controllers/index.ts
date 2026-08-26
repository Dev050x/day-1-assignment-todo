import type { Request, Response } from "express";
import z from "zod";
import { UserAuthSchema } from "../schema";
import { sendValidationError } from "../utils/zod-validation";
import { prisma } from "../lib/db";
import { preProcessFile } from "typescript";
import { create_token } from "../utils/jwt";

export async function signup(req: Request, res: Response) {
    const body = UserAuthSchema.safeParse(req.body);

    if(!body.success){
        return sendValidationError(res, body.error);
    }

    try {
        const user = await prisma.user.create({
            data: {
                username: body.data.username,
                password: body.data.password
            }
        });
    
        return res.status(200).json({
            msg: "user creted succefully",
            userId: user.id
        });
    } catch (error) {
        return res.status(400).json({
            msg: "user already exist"
        })
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

    const token = create_token(user.id);

    return res.status(200).json({
        msg: "user loggedin succefully",
        token
    });
}