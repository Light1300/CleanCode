// src/routes/user.ts
import { PrismaClient } from "@prisma/client/edge";
import { withAccelerate } from "@prisma/extension-accelerate";
import { Hono } from "hono";
import { sign } from "hono/jwt";
import { signupInputs } from "light1300/mediumCommon";
 

export const userRouter = new Hono<{
  Bindings: {
    DATABASE_URL: string;
    JWT_SECRET: string;  
  };
}>();



// -------------------- SIGNUP --------------------

userRouter.post("/signup", async (c) => {
  const prisma = new PrismaClient({
    datasourceUrl: c.env.DATABASE_URL,
  }).$extends(withAccelerate());

  try {
    // Parse and validate request body
    const body = await c.req.json();
    const parsed = signupInputs.safeParse(body);

    if (!parsed.success) {
      c.status(400);
      return c.json({})
    }

    const { email, name, password } = parsed.data;

    // Check if user exists
    const existingUser = await prisma.user.findUnique({
      where: { email },
    });

    if (existingUser) {
      c.status(409); // Conflict
      return c.json({ error: "User already exists" });
    }

    // Create user
    const user = await prisma.user.create({
      data: { email, name, password },
    });

    // Generate JWT
    const token = await sign({ id: user.id }, c.env.JWT_SECRET, "HS256");

    return c.json({ jwt: token });
  } catch (error) {
   
    c.status(500);
    return c.json({ error: "Internal server error" });
  } finally {
    await prisma.$disconnect();
  }
});

// -------------------- SIGNIN --------------------
userRouter.post("/signin", async (c) => {
  const prisma = new PrismaClient({
    datasourceUrl: c.env.DATABASE_URL,
  }).$extends(withAccelerate());

  try {
    const body = await c.req.json<{ email: string; password: string }>();

    if (!body.email || !body.password) {
      c.status(400);
      return c.json({ error: "Email and password are required" });
    }

    const user = await prisma.user.findUnique({
      where: { email: body.email },
    });

    if (!user || user.password !== body.password) {
      c.status(403);
      return c.json({ error: "Invalid email or password" });
    }

    const token = await sign({ id: user.id }, c.env.JWT_SECRET, "HS256");

    return c.json({ jwt: token });
  } catch (error) {
    c.status(500);
    return c.json({ error: "Internal server error" });
  } finally {
    await prisma.$disconnect();
  }
});
