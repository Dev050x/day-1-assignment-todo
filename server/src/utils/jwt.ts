import "dotenv/config"
import jwt from "jsonwebtoken";

export function create_token(userId: string): string {
    const token = jwt.sign({userId}, process.env.JWT_SECRET!);
    return token;
}