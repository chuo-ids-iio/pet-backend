import { Hono } from "hono"
import type { Env } from "../../bindings"
import { PrismaClient } from "@prisma/client"
import { PrismaD1 } from "@prisma/adapter-d1"
import { verifyToken } from "../../scripts/jwt"

const projects = new Hono<{ Bindings: Env }>()

type Question = {
  title: string
  content: string[]
}

projects.get("/", async (c) => {
  try {
    const prisma = new PrismaClient({ adapter: new PrismaD1(c.env.PET_D1) })
    const projects = await prisma.project.findMany()
    return c.json({
      projects,
    })
  } catch (e) {
    return new Response("Unauthorized", { status: 401 })
  }
})

projects.post("/new", async (c) => {
  try {
    const prisma = new PrismaClient({ adapter: new PrismaD1(c.env.PET_D1) })
    const auth = c.req.header("Authorization")
    if (!auth) {
      return new Response("Unauthorized", { status: 401 })
    }
    const token = auth.split(" ")[1]
    const { email } = await verifyToken(token, c.env.TOKEN_KEY)

    const user =
      (await prisma.user
        .findFirst({
          where: {
            email,
          },
        })
        .then((user) => user?.id)) || ""

    if (!user) {
      return new Response("Unauthorized", { status: 401 })
    }

    const { title, description } = await c.req.json()
    const project = await prisma.project.create({
      data: {
        title,
        description,
        userId: user,
      },
    })

    return c.json({
      project,
    })
  } catch (e) {
    return new Response("Unauthorized", { status: 401 })
  }
})

projects.delete("/:id", async (c) => {
  try {
    const prisma = new PrismaClient({ adapter: new PrismaD1(c.env.PET_D1) })
    const auth = c.req.header("Authorization")
    if (!auth) {
      return new Response("Unauthorized", { status: 401 })
    }
    const token = auth.split(" ")[1]
    const { email } = await verifyToken(token, c.env.TOKEN_KEY)

    const user =
      (await prisma.user
        .findFirst({
          where: {
            email,
          },
        })
        .then((user) => user?.id)) || ""

    if (!user) {
      return new Response("Unauthorized", { status: 401 })
    }

    const id = c.req.param("id")
    const project = await prisma.project.delete({
      where: {
        id: id as string,
      },
    })

    return c.json({
      project,
    })
  } catch (e) {
    return new Response("Unauthorized", { status: 401 })
  }
})

projects.get("/:id", async (c) => {
  try {
    const prisma = new PrismaClient({ adapter: new PrismaD1(c.env.PET_D1) })
    const id = c.req.param("id")
    const project = await prisma.project.findUnique({
      where: {
        id: id as string,
      },
    })

    const question = await prisma.phase.findFirst({
      where: {
        projectId: id as string,
      },
      orderBy: {
        createdAt: "desc",
      },
    })
    const phases = await prisma.phase.findMany({
      where: {
        projectId: id as string,
      },
      orderBy: {
        createdAt: "desc",
      },
    })

    return c.json({
      project,
      question,
      phases,
    })
  } catch (e) {
    return new Response("Unauthorized", { status: 401 })
  }
})

projects.post("/:id/new", async (c) => {
  try {
    const prisma = new PrismaClient({ adapter: new PrismaD1(c.env.PET_D1) })
    const auth = c.req.header("Authorization")
    if (!auth) {
      return new Response("Unauthorized", { status: 401 })
    }
    const token = auth.split(" ")[1]
    const { email } = await verifyToken(token, c.env.TOKEN_KEY)

    const user =
      (await prisma.user
        .findFirst({
          where: {
            email,
          },
        })
        .then((user) => user?.id)) || ""

    if (!user) {
      return new Response("Unauthorized", { status: 401 })
    }

    const id = c.req.param("id")
    const { question, type } = (await c.req.json()) as {
      question: Question
      type: string
    }

    const project = await prisma.phase.create({
      data: {
        questionBody: JSON.stringify(question),
        type,
        projectId: id as string,
      },
    })

    return c.json({
      project,
    })
  } catch (e) {
    return new Response("Unauthorized", { status: 401 })
  }
})

export default projects
