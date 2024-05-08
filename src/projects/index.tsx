import { Hono } from "hono";
import type { Env } from "../bindings";

const projects = new Hono<{ Bindings: Env }>();

projects.get("/", (c) => c.json({ message: "Hello, World!" }));
// app.route('/users', users)
export default projects;
