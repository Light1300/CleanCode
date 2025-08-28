import z from "zod";
// 🔹 Auth Schemas
export const signupInputs = z.object({
    email: z.string().email({ message: "Invalid email format" }),
    name: z.string().max(8, { message: "Name must be 8 characters or less" }),
    password: z.string().min(3, { message: "Password must be at least 3 characters" }),
});
export const signinInputs = z.object({
    email: z.string().email({ message: "Invalid email format" }),
    password: z.string().min(3, { message: "Password must be at least 3 characters" }),
});
// 🔹 Blog Schemas
export const createBlog = z.object({
    title: z.string().min(1, { message: "Title is required" }),
    content: z.string().min(3, { message: "Content must be at least 3 characters" }),
    // authorId removed: backend sets this using JWT
});
export const updateBlog = z.object({
    id: z.string(),
    title: z.string().min(1, { message: "Title is required" }),
    content: z.string().min(1, { message: "Content is required" }),
});
//# sourceMappingURL=index.js.map