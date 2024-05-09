import { type Context, Hono, type Next } from "hono"
import { jwt } from "hono/jwt"
import type { Env } from "./bindings"
import projects from "./routes/projects"
import users from "./routes/users"

const app = new Hono<{ Bindings: Env }>()

app.use(
  "/authed",
  async (
    c: Context<{
      Bindings: Env
    }>,
    next: Next,
  ) => jwt({ secret: c.env.TOKEN_KEY })(c, next),
)
app.options("*", (c) => {
  return new Response(null, {
    headers: {
      "Access-Control-Allow-Origin": "*",
      "Access-Control-Allow-Methods": "POST, OPTIONS",
      "Access-Control-Allow-Headers": "Content-Type, Authorization",
    },
  })
})

app.get("/", (c) => c.json({ message: "Hello, World!" }))
app.route("/accounts", users)
app.route("/projects", projects)
export default app
