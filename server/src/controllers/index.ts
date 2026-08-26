import type { Request, Response } from "express";
import { UserAuthSchema } from "../schema";
import { sendValidationError } from "../utils/zod-validation";
import { prisma } from "../lib/db";
import { create_token } from "../utils/jwt";
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