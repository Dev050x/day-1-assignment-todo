import { password } from "bun";
import z, { string } from "zod";

export const UserAuthSchema = z.object({
    username: string().min(3, "username must be 3 character long"),
    password: string().min(6, "password must be 6 character long")
});