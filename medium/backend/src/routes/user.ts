// src/routes/user.ts
import { PrismaClient } from "@prisma/client/edge";
import { withAccelerate } from "@prisma/extension-accelerate";
import { Hono } from "hono";
import { sign, verify } from "hono/jwt"; 
import { signupInputs } from "@light1300/medium-common";

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
    const body = await c.req.json();
    const parsed = signupInputs.safeParse(body);

    if (!parsed.success) {
      c.status(400);
      return c.json({ message: "Invalid input" });
    }

    const { email, name, password } = parsed.data;

    // Check if user exists
    const existingUser = await prisma.user.findUnique({
      where: { email },
    });
    if (existingUser) {
      c.status(409);
      return c.json({ message: "User already exists" });
    }

    // Create user
    const user = await prisma.user.create({
      data: { email, name, password },
    });

    // Generate token
    const token = await sign({ id: user.id }, c.env.JWT_SECRET, "HS256");
    return c.json({ jwt: token });
  } catch (error) {
    c.status(500);
    return c.json({ message: "Internal server error" });
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
      return c.json({ message: "Email and password are required" });
    }

    const user = await prisma.user.findUnique({
      where: { email: body.email },
    });

    if (!user || user.password !== body.password) {
      c.status(403);
      return c.json({ message: "Invalid email or password" });
    }

    const token = await sign({ id: user.id }, c.env.JWT_SECRET, "HS256");
    return c.json({ jwt: token });
  } catch (error) {
    c.status(500);
    return c.json({ message: "Internal server error" });
  } finally {
    await prisma.$disconnect();
  }
});

// -------------------- GET USER --------------------
userRouter.get("/getuser/:id", async (c) => {
  const prisma = new PrismaClient({
    datasourceUrl: c.env.DATABASE_URL,
  }).$extends(withAccelerate());

  try {
    const userId = c.req.param("id");
    const user = await prisma.user.findUnique({
      where: { id: userId },
    });

    if (!user) {
      c.status(404);
      return c.json({ message: "User not found" });
    }

    return c.json({ name: user.name, email: user.email });
  } catch {
    c.status(500);
    return c.json({ message: "Internal server error" });
  } finally {
    await prisma.$disconnect();
  }
});

// -------------------- CHECK USER (AUTH) --------------------
userRouter.get("/check", async (c) => {
  try {
    const token = c.req.header("Authorization") || "";
    const payload = await verify(token, c.env.JWT_SECRET, "HS256");
    return c.json({ valid: true, payload });
  } catch {
    c.status(403);
    return c.json({ message: "Unauthorized" });
  }
});
