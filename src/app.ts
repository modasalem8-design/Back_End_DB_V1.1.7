import { join } from 'node:path'
import AutoLoad, { AutoloadPluginOptions } from '@fastify/autoload'
import { FastifyPluginAsync, FastifyServerOptions } from 'fastify'
import 'dotenv/config'
import '@fastify/postgres'
import fastifyCors from '@fastify/cors'
export interface AppOptions extends FastifyServerOptions, Partial<AutoloadPluginOptions> {

}
// Pass --options via CLI arguments in command to enable these options.
const options: AppOptions = {
  caseSensitive: false
}

//generic type 

const app: FastifyPluginAsync<AppOptions> = async (
  fastify,
  opts
): Promise<void> => {
  // Place here your custom code!
  fastify.register(fastifyCors)
  fastify.get('/', async (request, reply) => {
    return reply.code(200).send({ "message": "welcom to BackEnd_DataBase_V1.1.6,please go to /user to see more information" })
  })
  // Do not touch the following lines
  // This loads all plugins defined in plugins
  // those should be support plugins that are reused
  // through your application
  // eslint-disable-next-line no-void

// قرأة الملفات 
  void fastify.register(AutoLoad, {
    dir: join(__dirname, 'plugins'),
    options: opts
  })
  // This loads all plugins defined in routes
  // define your routes in one of these
  // eslint-disable-next-line no-void
  void fastify.register(AutoLoad, {
    dir: join(__dirname, 'routes'),
    options: opts
  })

  void fastify.register(AutoLoad, {
    dir: join(__dirname, 'service'),
    options: opts
  })
  void fastify.register(AutoLoad,{
    dir:join(__dirname,"modules"),
    options:opts
  })
//  void fastify.register(AutoLoad,{
//   dir:join(__dirname,''),
//   options:opts
//  })
  // void fastify.register(AutoLoad, {
  //   dir: join(__dirname, 'controllers'),
  //   options: opts
  // })
}
export default app
export { app, options }
