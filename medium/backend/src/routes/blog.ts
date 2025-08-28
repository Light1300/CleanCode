import { PrismaClient } from "@prisma/client/edge";
import { withAccelerate } from "@prisma/extension-accelerate";
import { Hono } from "hono";
import { verify } from "hono/jwt";

export const bookRouter = new Hono<{
  Bindings: {
    DATABASE_URL: string;
    JWT_SECRET: string;
  },
  Variables: {
    userId: string;
  }
}>();

// Middleware for JWT verification
bookRouter.use(async (c, next) => {
  const authHeader = c.req.header("Authorization");
  if (!authHeader) {
    c.status(401);
    return c.json({ error: "Authorization header missing" });
  }

  const token = authHeader.startsWith("Bearer ")
    ? authHeader.split(" ")[1]
    : authHeader; // allow raw token too

  try {
    const payload = await verify(token, c.env.JWT_SECRET);
    if (!payload?.id) {
      c.status(401);
      return c.json({ error: "Invalid token" });
    }//@ts-ignore
    c.set("userId", payload.id);
    await next();
  } catch (err) {
    c.status(401);
    return c.json({ error: "Token verification failed" });
  }
});

// Create a new post
bookRouter.post("/add", async (c) => {
  try {
    const userId = c.get("userId");
    const prisma = new PrismaClient({
      datasourceUrl: c.env.DATABASE_URL,
    }).$extends(withAccelerate());

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
bookRouter.put("/", async (c) => {
  try {
    const userId = c.get("userId");
    const prisma = new PrismaClient({
      datasourceUrl: c.env.DATABASE_URL,
    }).$extends(withAccelerate());

    const body = await c.req.json();
    await prisma.post.update({
      where: { id: body.id, authorId: userId },
      data: { title: body.title, content: body.content },
    });

    return c.text("Post updated successfully");
  } catch (err) {
    c.status(500);
    return c.json({ error: "Failed to update post", details: `${err}` });
  }
});

// Get all posts
bookRouter.get("/bulk", async (c) => {
  try {
    const prisma = new PrismaClient({
      datasourceUrl: c.env.DATABASE_URL,
    }).$extends(withAccelerate());

    const posts = await prisma.post.findMany({});
    return c.json({ posts });
  } catch (err) {
    c.status(500);
    return c.json({ error: "Failed to fetch posts" });
  }
});

// Get a single post
bookRouter.get("/:id", async (c) => {
  try {
    const id = c.req.param("id");
    const prisma = new PrismaClient({
      datasourceUrl: c.env.DATABASE_URL,
    }).$extends(withAccelerate());

    const post = await prisma.post.findUnique({ where: { id } });
    if (!post) {
      c.status(404);
      return c.json({ error: "Post not found" });
    }

    return c.json(post);
  } catch (err) {
    c.status(500);
    return c.json({ error: "Failed to fetch post" });
  }
});
