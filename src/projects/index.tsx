import { Hono } from "hono";
import type { Env } from "../bindings";
import { PrismaClient } from "@prisma/client";
import { PrismaD1 } from "@prisma/adapter-d1";

const projects = new Hono<{ Bindings: Env }>();

projects.get("/", async (c) => {
	const prisma = new PrismaClient({ adapter: new PrismaD1(c.env.PET_D1) });

	const projects = await prisma.project.findMany();
	return c.json({
		projects,
	});
});
// app.route('/users', users)
export default projects;
