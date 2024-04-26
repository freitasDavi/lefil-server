import { FastifyInstance } from "fastify"
import { createAccount } from "./auth/create-account"

export default async function (app: FastifyInstance) {
    app.get("/", async (request, reply) => {
        return reply.send({
            message: "Hello world"
        })
    })
    
    app.get("/ping", async (request, reply) => {
        return "pong"
    })

    app.register(createAccount)
    
}