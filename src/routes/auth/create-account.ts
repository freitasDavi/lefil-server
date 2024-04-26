import type { FastifyInstance } from "fastify";
import type { ZodTypeProvider } from "fastify-type-provider-zod";
import { z } from "zod";
import { prisma } from "@/lib/prisma";
import { compare, hash } from "bcryptjs";

export async function createAccount (app: FastifyInstance) {
    app.withTypeProvider<ZodTypeProvider>().post('/users', {
        schema: {
            tags: ['auth'], 
            summary: 'Create a new account',
            body: z.object({
                name: z.string(),
                email: z.string(),
                password: z.string().min(6)
            })
        }
    }, async (request, reply) => {
        const { name, email, password } = request.body

        const userWithSameEmail = await prisma.user.findUnique({
            where: { email }
        })

        if (userWithSameEmail) {
            reply.status(400).send({
                message: 'User with same e-mail already exist'
            })
        }

        const passwordHash = await hash(password, 6)

        await prisma.user.create({
            data: {
                name,
                email,
                passwordHash
            }
        })

        return reply.status(201).send()
    })
}

export async function login(app: FastifyInstance) {
    app.withTypeProvider<ZodTypeProvider>().post('/session', {
        schema: {
            tags: ['auth'],
            summary: 'login',
            body: z.object({
                email: z.string(),
                password: z.string().min(6)
            })
        }
    }, async (request, reply) => {
        const { email, password } = request.body

        const userFromEmail = await prisma.user.findUnique({
            where: { email }
        })

        if (!userFromEmail) {
            return reply.status(400).send({
                message: 'Invalid credentials'
            })
        }

        const isPasswordValid = await compare(
            password,
            userFromEmail.passwordHash
        )

        if (!isPasswordValid) {
            reply.status(400).send({
                message: 'Invalid credentials'
            })
        }

        const token = await reply.jwtSign({
            sub: userFromEmail.id
        }, {
            sign: {
                expiresIn: '7d'
            }
        })

        return reply.status(200).send({ token: token })
    })
}