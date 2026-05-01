import fp from "fastify-plugin";
import crypto from "crypto";
export default fp(async (fastify) => {
    await fastify.register(import("@fastify/rate-limit"), {
        max: 20,
        ban: 5,
        hook: 'preHandler',
        timeWindow: 5 * 60 * 1000,

        keyGenerator:(request)=>{
            return fingerprint(request)
        },
        addHeaders: { // default show all the response headers when rate limit is reached
            "x-ratelimit-limit": true,
            "x-ratelimit-remaining": true,
            "x-ratelimit-reset": true,
            "retry-after": true,
        },
    });


    function fingerprint(request: any) {
    const ip = request.ip;
    const ua = request.headers["user-agent"] || "";
    const lang = request.headers["accept-language"] || "";
    const origin = request.headers["origin"] || "";

    const raw = `${ip}|${ua}|${lang}|${origin}`;

    return crypto.createHash("sha256").update(raw).digest("hex");
}


    fastify.setNotFoundHandler({
        preHandler: fastify.rateLimit(),
    }, function (request, reply) {
        reply.code(404).send({ "error ": "page not found please go to /" });
    });
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