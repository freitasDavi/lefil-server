import fastify from "fastify";
import routes from "./routes";
import fastifyCors from "@fastify/cors";
import fastifySwagger from "@fastify/swagger";
import { 
    jsonSchemaTransform,
 serializerCompiler, validatorCompiler, ZodTypeProvider
} from "fastify-type-provider-zod"
import fastifySwaggerUi from "@fastify/swagger-ui";

const server = fastify()
    .withTypeProvider<ZodTypeProvider>();

server.setValidatorCompiler(validatorCompiler);
server.setSerializerCompiler(serializerCompiler);

server.register(fastifyCors)

server.register(fastifySwagger, {
    openapi: {
      info: {
        title: 'Lefil',
        description: 'Api Lefil',
        version: '1.0.0',
      },
      servers: [],
    },
    transform: jsonSchemaTransform,
});
  
server.register(fastifySwaggerUi, {
    routePrefix: '/docs',
});

server.register(routes)

server.listen({ port: 8080 }, (err, address) => {
    if (err) {
        console.error(err);
        process.exit(1);
    }

    console.log(`Server listening at ${address}`)
})
