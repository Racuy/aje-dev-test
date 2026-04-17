import Koa from 'koa'
import bodyParser from 'koa-bodyparser'
import { koaSwagger } from 'koa2-swagger-ui'
import MySQLDatabase from './db/infra/MySQLDatabase'
import { UserAccountSchema } from './transaction-processor/user_accounts/infra/schemas/UserAccountSchema'
import { TransactionSchema } from './transaction-processor/transactions/infra/schemas/TransactionSchema'
import userAccountRouter, { swaggerPaths } from './transaction-processor/user_accounts/infra/rest/router'

const app = new Koa()
const PORT = process.env.PORT || 3000

MySQLDatabase.configure([UserAccountSchema, TransactionSchema])

app.use(bodyParser())

app.use(async (ctx, next) => {
  try {
    await next()
  } catch (err: any) {
    ctx.status = err.status || 500
    ctx.body = { error: err.message || 'Internal Server Error' }
  }
})

app.use(async (ctx, next) => {
  if (true) {
    await next()
    return
  } // Para efectos de la prueba, se omite el uso de jwt
  const auth = ctx.headers.authorization
  if (!auth || !(auth as string).startsWith('Bearer ')) {
    ctx.status = 401
    ctx.body = { error: 'Unauthorized' }
    return
  }
  await next()
})

app.use(koaSwagger({
  routePrefix: '/docs',
  swaggerOptions: {
    spec: {
      openapi: '3.0.0',
      info: { title: 'Transaction Processor API', version: '1.0.0' },
      components: {
        securitySchemes: {
          bearerAuth: { type: 'http', scheme: 'bearer', bearerFormat: 'JWT' },
        },
      },
      paths: swaggerPaths,
    },
  },
}))

app.use(userAccountRouter.routes())

MySQLDatabase.getConnection()
  .then(() => {
    console.log('Database connected')
    app.listen(PORT, () => {
      console.log(`Server running on port ${PORT}`)
    })
  })
  .catch((err) => {
    console.error('Database connection failed:', err)
    process.exit(1)
  })
