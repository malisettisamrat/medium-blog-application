import { PrismaClient } from "@prisma/client/edge";
import { withAccelerate } from "@prisma/extension-accelerate";
import { Hono } from "hono";
import { sign } from "hono/jwt";
/*

POST /api/v1/user/signup
POST /api/v1/user/signin
POST /api/v1/blog
PUT /api/v1/blog
GET /api/v1/blog/:id
GET /api/v1/blog/bulk

*/

const app = new Hono<{
  Bindings: {
    DATABASE_URL: string;
    JWT_SECRET: string;
  };
}>();

app.get("/", (c) => {
  return c.html("<h1> Welcome to the Main Page </h1>");
});

app.get("/api/v1/blog/:id", (c) => {
  const blogId = c.req.param("id");
  console.log(blogId, "Blog ID params");
  return c.text("Get Blog with id..");
});

app.get("/api/v1/blog/bulk", (c) => {
  return c.text("get bulk blogs..");
});

app.post("/api/v1/signup", async (c) => {
  // initialize prisma client
  const prisma = new PrismaClient({
    datasourceUrl: c.env.DATABASE_URL,
  }).$extends(withAccelerate());

  // get the body in the json format
  const body = await c.req.json();

  try {
    // create a user object from the request
    const user = await prisma.user.create({
      data: {
        email: body.email,
        password: body.password,
      },
    });

    const payload = {
      id: user.id,
    };
    const token = await sign(payload, c.env.JWT_SECRET);

    // return the JWT token
    return c.json(token);
  } catch (error) {
    console.log("Im hereree");
    return c.status(403);
  }
});

app.post("/api/v1/user/signin", (c) => {
  const prisma = new PrismaClient({
    datasourceUrl: c.env.DATABASE_URL,
  }).$extends(withAccelerate());

  const headerValue = c.req.header("header-name");

  // c.header(); // setting the header
  // c.status(); // sending the status response
  // c.text(); // set the text
  // c.html(); // in order to send the HTML

  return c.text("User Signin..");
});

app.post("/api/v1/blog", (c) => {
  return c.text("Created a blog..");
});

app.put("/api/v1/blog", (c) => {
  return c.text("Update the blog...");
});

export default app;
