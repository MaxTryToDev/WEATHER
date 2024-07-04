//Import de ZOD
import { z } from "zod";

export const registerSchema = z.object({
    email: z.string().email(),
    password: z.string().min(8),
});

export const loginSchema = z.object({
    email: z.string().email(),
    password: z.string().min(8),
});

export const updatePasswordSchema = z.object({
    oldPassword: z.string().min(8),
    newPassword: z.string().min(8),
});