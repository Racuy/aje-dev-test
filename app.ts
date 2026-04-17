import Koa from 'koa'
import bodyParser from 'koa-bodyparser'
import MySQLDatabase from './db/infra/MySQLDatabase'

const app = new Koa()
const PORT = process.env.PORT || 3000

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
  const auth = ctx.headers.authorization
  if (!auth || !auth.startsWith('Bearer ')) {
    ctx.status = 401
    ctx.body = { error: 'Unauthorized' }
    return
  }
  await next()
})

app.use(async (ctx) => {
  ctx.body = { status: 'ok' }
})

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
