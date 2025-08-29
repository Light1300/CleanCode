import z from "zod";
export declare const signupInputs: z.ZodObject<{
    email: z.ZodString;
    name: z.ZodString;
    password: z.ZodString;
}, z.z.core.$strip>;
export declare const signinInputs: z.ZodObject<{
    email: z.ZodString;
    password: z.ZodString;
}, z.z.core.$strip>;
export declare const createBlog: z.ZodObject<{
    title: z.ZodString;
    content: z.ZodString;
}, z.z.core.$strip>;
export declare const updateBlog: z.ZodObject<{
    id: z.ZodString;
    title: z.ZodString;
    content: z.ZodString;
}, z.z.core.$strip>;
export type SignupInputs = z.infer<typeof signupInputs>;
export type SigninInputs = z.infer<typeof signinInputs>;
export type CreateBlog = z.infer<typeof createBlog>;
export type UpdateBlog = z.infer<typeof updateBlog>;
//# sourceMappingURL=index.d.ts.map