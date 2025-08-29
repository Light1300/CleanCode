import { PrismaClient } from "@prisma/client/edge";
import { withAccelerate } from "@prisma/extension-accelerate";
import { Hono } from "hono";
import { verify } from "hono/jwt";

export const blogRouter = new Hono<{
  Bindings: {
    DATABASE_URL: string;
    JWT_SECRET: string;
  };
  Variables: {
    userId: string;
  };
}>();

// ---------------------------
// CORS preflight
blogRouter.options("/*", (c) => {
  return c.text("ok", 200)
    .header("Access-Control-Allow-Origin", "*")
    .header("Access-Control-Allow-Headers", "Authorization, Content-Type")
    .header("Access-Control-Allow-Methods", "GET, POST, PUT, DELETE, OPTIONS");
});

// ---------------------------
// Middleware: Verify JWT
blogRouter.use("/*", async (c, next) => {
  const authHeader = c.req.header("Authorization");
  if (!authHeader) {
    return c.json({ error: "Authorization header missing" }, 401);
  }

  const token = authHeader.startsWith("Bearer ")
    ? authHeader.split(" ")[1]
    : authHeader;

  try {
    const payload = await verify(token, c.env.JWT_SECRET);
    if (!payload?.id) {
      return c.json({ error: "Invalid token" }, 401);
    }//@ts-ignore
    c.set("userId", payload.id);
    await next();
  } catch (err) {
    return c.json({ error: "Token verification failed", details: `${err}` }, 401);
  }
});

// ---------------------------
// Get all published blogs
blogRouter.get("/bulk", async (c) => {
  const prisma = new PrismaClient({ datasourceUrl: c.env.DATABASE_URL }).$extends(withAccelerate());

  try {
    const posts = await prisma.post.findMany({
      where: { published: true },
      select: {
        id: true,
        title: true,
        content: true,
        published: true,
        author: { select: { name: true } }, // fetch author name
      },
    });

    const blogs = posts.map((p) => ({
      id: p.id,
      title: p.title,
      content: p.content,
      published: p.published,
      authorName: p.author?.name ?? "Anonymous",
    }));

    return c.json({ blogs }, 200);
  } catch (err) {
    return c.json({ error: "Failed to fetch blogs", details: `${err}` }, 500);
  }
});

// ---------------------------
// Get single blog by ID
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
        published: true,
        author: { select: { name: true } },
      },
    });

    if (!post) return c.json({ error: "Post not found" }, 404);

    const blog = {
      id: post.id,
      title: post.title,
      content: post.content,
      published: post.published,
      authorName: post.author?.name ?? "Anonymous",
    };

    return c.json({ blog }, 200);
  } catch (err) {
    return c.json({ error: "Failed to fetch blog", details: `${err}` }, 500);
  }
});

// ---------------------------
// Create new blog
blogRouter.post("/", async (c) => {
  const prisma = new PrismaClient({ datasourceUrl: c.env.DATABASE_URL }).$extends(withAccelerate());
  const userId = c.get("userId");

  try {
    const body = await c.req.json();
    if (!body.title || !body.content) {
      return c.json({ error: "Title and content required" }, 400);
    }

    const post = await prisma.post.create({
      data: {
        title: body.title,
        content: body.content,
        authorId: userId,
        published: body.published ?? false,
      },
    });

    return c.json({ id: post.id }, 201);
  } catch (err) {
    return c.json({ error: "Failed to create blog", details: `${err}` }, 500);
  }
});

// ---------------------------
// Update blog
blogRouter.put("/", async (c) => {
  const prisma = new PrismaClient({ datasourceUrl: c.env.DATABASE_URL }).$extends(withAccelerate());
  const userId = c.get("userId");

  try {
    const body = await c.req.json();
    if (!body.id) return c.json({ error: "Blog ID required" }, 400);

    const updated = await prisma.post.updateMany({
      where: { id: body.id, authorId: userId },
      data: {
        title: body.title,
        content: body.content,
        published: body.published ?? undefined,
      },
    });

    if (updated.count === 0)
      return c.json({ error: "Blog not found or unauthorized" }, 404);

    return c.json({ message: "Blog updated successfully" }, 200);
  } catch (err) {
    return c.json({ error: "Failed to update blog", details: `${err}` }, 500);
  }
});
