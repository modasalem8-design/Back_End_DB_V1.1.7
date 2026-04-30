// استعادات
import { type FastifyPluginAsync } from "fastify";
import "dotenv/config";
// تعريف الدالة الاساسية
const user: FastifyPluginAsync = async (fastify, opts): Promise<void> => {
  // الاول الملف الي بيتكتب في كلمة المرور لاكن get
  fastify.get("/user_inf", async (request, reply) => {
    return ({ "error": "please Enter Secret To See information" });
  });
  // توجية الadmin  لي لروية مستخدمينة ووضع كلمة المرور
  fastify.get("/user_i", async function (request, reply) {
    const use = await fastify.pg.connect();
    try {
      return reply.code(200).send({
        "err": "please Enter the secret to see more information in /user-i",
      });
    } catch (err) {
      console.error(err);
    } finally {
      use.release();
    }
  });
  // الاول الملف الي بيتكتب في كلمة المرور لاكن post
  // { schema: { body: { $ref: "pass_admin" } } },
  fastify.post(
    "/user_i",
    
    async function (request, reply) {
      // تعريف دالة الربط
      const use = await fastify.pg.connect();
      try {
        const passall: any = process.env.PASS 
        const body = request.body as any;
        const pass = body?.pass;
        // const { pass_admin } = request.body as any;
        // const virefy = await use.query(
        //   "SELECT * FROM admin WHERE pass_admin=$1",
        //   [pass_admin]
        // );
        // if (virefy) {
        //   console.log("شطور")}
        if (!pass || String(pass) !== String(passall)) {
      return reply.code(401).send({ error: "please enter true pass" });
    }
          const user_post = await use.query(
            "SELECT name FROM user_post GROUP BY name",
          );
          const post_c = await use.query(
            "SELECT post,com FROM post_c GROUP BY post,com",
          );

          return reply.code(200).send({
            "post and user ": "finsh ",
            user_post: user_post.rows,
            post: post_c.rows,
          });
      } catch (error) {
        console.error(error);
        return reply.code(500).send({ error: error});
      } finally {
        if (use) use.release();
      }
    },
  );
};
export default user;
