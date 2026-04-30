import { FastifyPluginAsync } from "fastify";

//تعريفات
const login: FastifyPluginAsync = async (fastify): Promise<void> => {
    const use = await fastify.pg.connect();
    // انشاء تسجيل الدخول
    fastify.post(
        "/login",
        { schema: { body: { $ref: "userSchema#" } } },
        async (request, reply) => {
            // تعريف الاسم وكلمة مرور واستلامهم من المستخدم
            const { name, pass } = request.body as any;
            try {
                const log = await use.query("SELECT * FROM user_post WHERE name=$1 ;", [name]
                );
                // الشرط1
                if (log.rows.length === 0) {
                    return reply.code(401).send({ "Error": "User Undefind Please Create Account " });
                }
                // الشرط 2
                if (log) {
                    return reply.code(201).send({
                        "message": "login  successfull",
                        name: name,
                        pass: pass,
                    });
                } else {
                    return reply.code(401).send({ "error": "user undfind" });
                }
            } catch (err) {
                console.error(err), reply.code(501).send({ "err": err });
            } finally {
                use.release();
            }
        },
    );
}; // تعريف دالة الاتصال


export default login;
// // ,{schema:{
//     body:{$ref:"userSchema#"}
