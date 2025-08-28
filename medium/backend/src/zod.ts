import z from "zod"

// zod input schema backend signup requirement
export const signupInputs = z.object({
    email: z.string().email(),
    name: z.string().max(8),
    password: z.string().min(3)
}); 


//Frontend will require zod infer for easy use obj members
export type SignupInputs     = z.infer<typeof signupInputs>