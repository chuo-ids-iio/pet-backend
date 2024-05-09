import { Hono } from "hono";
import type { Env } from "../../bindings";
import { PrismaClient } from "@prisma/client";
import { PrismaD1 } from "@prisma/adapter-d1";
import { verifyToken } from "../../scripts/jwt";

const projects = new Hono<{ Bindings: Env }>();

projects.get("/", async (c) => {
	try {
		const prisma = new PrismaClient({ adapter: new PrismaD1(c.env.PET_D1) });
		const projects = await prisma.project.findMany();
		return c.json({
			projects,
		});
	} catch (e) {
		return new Response("Unauthorized", { status: 401 });
	}
});

projects.post("/new", async (c) => {
	try {
		const prisma = new PrismaClient({ adapter: new PrismaD1(c.env.PET_D1) });
		const auth = c.req.header("Authorization");
		if (!auth) {
			return new Response("Unauthorized", { status: 401 });
		}
		const token = auth.split(" ")[1];
		const { email } = await verifyToken(token, c.env.TOKEN_KEY);

		const user =
			(await prisma.user
				.findFirst({
					where: {
						email,
					},
				})
				.then((user) => user?.id)) || "";

		if (!user) {
			return new Response("Unauthorized", { status: 401 });
		}

		const { title, description } = await c.req.json();
		const project = await prisma.project.create({
			data: {
				title,
				description,
				userId: user,
			},
		});

		return c.json({
			project,
		});
	} catch (e) {
		return new Response("Unauthorized", { status: 401 });
	}
});

// app.route('/users', users)
export default projects;
