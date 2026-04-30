import fp from "fastify-plugin";

export default fp(async (fastify) => {
    await fastify.register(import("@fastify/rate-limit"), {
        max: 20,
        timeWindow: "5 minute",
        addHeaders: { // default show all the response headers when rate limit is reached
            "x-ratelimit-limit": true,
            "x-ratelimit-remaining": true,
            "x-ratelimit-reset": true,
            "retry-after": true,
        },
    });

    // fastify.setErrorHandler(function (error, request, reply) {
    //     const err_ma = (error as FastifyError).statusCode;
    //     console.error(error);
    //     if (err_ma) {
    //         reply.code(429).send({
    //             "mes_err": error,
    //         });
    //     }
    // });

    fastify.setNotFoundHandler({
        preHandler: fastify.rateLimit(),
    }, function (request, reply) {
        reply.code(404).send({ "error ": "page not found please go to /" });
    });
});
