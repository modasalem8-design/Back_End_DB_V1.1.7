// استعادات
import { type FastifyPluginAsync } from "fastify";
import bcrypt from "bcryptjs";
import "dotenv/config";
// تعريف الدالة الاساسية
const create: FastifyPluginAsync = async (fastify, opts): Promise<void> => {
    // متغير مؤقت
    const use = await fastify.pg.connect();
    //تعريفات crud
    //  const { name, pass } = request.body as any;}
    // للمتصفح
    fastify.get("/api_create", async (request, reply) => {
        
        // const secret ="1234"
        // const hasw= await bcrypt.hash(secret,15)
        // reply.send(hasw)
        return reply.send({ " message": "connect  true api_crud" });
    });
    // انشاء حساب
    fastify.post(
        "/api_create",
        {
            schema: {
                body: { $ref: "userSchema#" },
            },
        },
        async (request, reply) => {
            try {
                // fastify.decorate('db',use)
                // تعريفات
                const { name, pass } = request.body as any;
                const hash = await bcrypt.hash(pass, 10);

                //تعريف الsqlالي هيعمل انشاء مع تأمينة
                const creat = await use.query(
                    "INSERT INTO user_post(name,pass) VALUES ($1,$2);",
                    [name, pass],
                );
                if (creat) {
                    return ({
                        "message": "create account successfull",
                        name: name,
                        pass: hash,
                    });
                }
                //الرجوع بي الخطأ
            } catch (err) {
                console.log("err in :\n");
                console.error(err);
                return ({ "err": err });
            }
        },
    );
    // حذف حساب
    fastify.get("/api-crud", async (request, reply) => {
        return ({ "message": "connect" });
    });
    fastify.delete("/api_crud", async (request, reply) => {
        try {
            const { name, pass } = request.body as any;
            const delelt = await use.query(
                "DELETE FROM user_post WHERE name = $1,pass;",
                [name, pass],
            );
            if (delelt) {
                return ({ "message": "delete finsh" });
            }
        } catch (err) {
            console.error(err);
        } finally {
            use.release();
        }
    });
};
export default create;

// curl --location 'http://localhost:3000/api-crud' --header 'Content-Type: application/json' --data '{"name":"ahmed","pass":"12345"}'
