import { PrismaClient } from "@prisma/client/edge";
import { withAccelerate } from "@prisma/extension-accelerate";
import { Hono } from "hono";
import { verify } from "hono/jwt";

export const blogRouter = new Hono<{
  Bindings: {
    DATABASE_URL: string;
    JWT_SECRET: string;
  },
  Variables: {
    userId: string;
  };
}>();

// Middleware: Verify JWT (with Bearer token support)
blogRouter.use("/*", async (c, next) => {
  const authHeader = c.req.header("Authorization");
  if (!authHeader) {
    c.status(401);
    return c.json({ error: "Authorization header missing" });
  }

  const token = authHeader.startsWith("Bearer ")
    ? authHeader.split(" ")[1]
    : authHeader;

  try {
    const payload = await verify(token, c.env.JWT_SECRET);
    if (!payload?.id) {
      c.status(401);
      return c.json({ error: "Invalid token" });
    }//@ts-ignore
    c.set("userId", payload.id);
    await next();
  } catch {
    c.status(401);
    return c.json({ error: "Token verification failed" });
  }
});

// Create a new post
blogRouter.post("/", async (c) => {
  const prisma = new PrismaClient({ datasourceUrl: c.env.DATABASE_URL }).$extends(withAccelerate());
  const userId = c.get("userId");

  try {
    const body = await c.req.json();
    if (!body.title || !body.content) {
      c.status(400);
      return c.json({ error: "Title and content are required" });
    }

    const post = await prisma.post.create({
      data: {
        title: body.title,
        content: body.content,
        authorId: userId,
      },
    });

    return c.json({ id: post.id });
  } catch (err) {
    c.status(500);
    return c.json({ error: "Failed to create post", details: `${err}` });
  }
});

// Update a post
blogRouter.put("/", async (c) => {
  const prisma = new PrismaClient({ datasourceUrl: c.env.DATABASE_URL }).$extends(withAccelerate());
  const userId = c.get("userId");

  try {
    const body = await c.req.json();
    await prisma.post.update({
      where: { id: body.id, authorId: userId },
      data: { title: body.title, content: body.content },
    });

    return c.json({ message: "Post updated successfully" });
  } catch (err) {
    c.status(500);
    return c.json({ error: "Failed to update post", details: `${err}` });
  }
});

// Get all posts
blogRouter.get("/bulk", async (c) => {
  const prisma = new PrismaClient({ datasourceUrl: c.env.DATABASE_URL }).$extends(withAccelerate());
  try {
    const posts = await prisma.post.findMany({
      select: {
        id: true,
        title: true,
        content: true,
        author: { select: { name: true } },
      },
    });
    return c.json({ posts });
  } catch {
    c.status(500);
    return c.json({ error: "Failed to fetch posts" });
  }
});

// Get a single post
blogRouter.get("/:id", async (c) => {
  const prisma = new PrismaClient({ datasourceUrl: c.env.DATABASE_URL }).$extends(withAccelerate());

  try {
    const id = c.req.param("id");
    const post = await prisma.post.findUnique({
      where: { id },
      select: {
        id: true,
        title: true,
        content: true,
        author: { select: { name: true } },
      },
    });

    if (!post) {
      c.status(404);
      return c.json({ error: "Post not found" });
    }
    return c.json(post);
  } catch {
    c.status(500);
    return c.json({ error: "Failed to fetch post" });
  }
});
