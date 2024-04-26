import fastify from "fastify";
import routes from "./routes";
import fastifyCors from "@fastify/cors";
import { 
 serializerCompiler, validatorCompiler, ZodTypeProvider
} from "fastify-type-provider-zod"

const server = fastify()
    .withTypeProvider<ZodTypeProvider>();

server.setValidatorCompiler(validatorCompiler);
server.setSerializerCompiler(serializerCompiler);

server.register(fastifyCors)

server.register(routes)

server.listen({ port: 8080 }, (err, address) => {
    if (err) {
        console.error(err);
        process.exit(1);
    }

    console.log(`Server listening at ${address}`)
})
