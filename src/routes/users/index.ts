import { Hono } from "hono";
import { sha3_512 } from "js-sha3";
import { PrismaD1 } from "@prisma/adapter-d1";
import { PrismaClient } from "@prisma/client";
import {
	createRefreshToken,
	createToken,
	verifyRefreshToken,
} from "../../scripts/jwt";
import type { Env } from "../../bindings";

const users = new Hono<{ Bindings: Env }>();

users.post("/new", async (c) => {
	const adapter = new PrismaD1(c.env.PET_D1);
	const prisma = new PrismaClient({ adapter });

	const { email, password, name } = await c.req.json();
	const user = await prisma.user.create({
		data: {
			email,
			passwordHashed: sha3_512(password + c.env.SALT),
			name,
		},
	});
	if (!user) {
		return new Response("Failed to create user", { status: 500 });
	}
	return c.json({ email: user.email });
});

users.post("/login", async (c) => {
	const adapter = new PrismaD1(c.env.PET_D1);
	const prisma = new PrismaClient({ adapter });
	const { email, password } = await c.req.json();
	const user = await prisma.user.findFirst({
		where: {
			email,
			passwordHashed: sha3_512(password + c.env.SALT),
		},
	});
	if (!user) {
		return new Response("Invalid Login Credentials", { status: 401 });
	}
	const content = {
		token: await createToken({ email: user.email }, c.env.TOKEN_KEY),
	};
	return c.json(content);
});

export default users;
