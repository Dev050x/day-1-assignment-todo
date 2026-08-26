import "dotenv/config"
import type { NextFunction, Request, Response } from "express";
import jwt from "jsonwebtoken";

export function create_token(userId: string): string {
    const token = jwt.sign({userId}, process.env.JWT_SECRET!);
    return token;
}

interface TokenPayload {
    userId: string
}

export function require_auth(req: Request, res: Response, next: NextFunction){
    const token = req.headers.authorization?.split(" ")[1];
    if(!token) {
        return res.status(400).json({
            msg: "please logged in first"
        })
    }

    try {
        const payload = jwt.verify(token, process.env.JWT_SECRET!)as TokenPayload;
        req.userId = payload.userId;
        next()
    } catch (error) {
        return res.status(400).json({
            msg: "Please Provide Valid token"
        })
    }
}