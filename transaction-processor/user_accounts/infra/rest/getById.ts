import Router from '@koa/router'
import { UserAccountRepository } from '../repositories/UserAccountRepository'

const router = new Router()

router.get('/user_accounts/:id', async (ctx) => {
  const account = await new UserAccountRepository().findById(Number(ctx.params.id))
  if (!account) {
    ctx.status = 404
    ctx.body = { error: 'Account not found' }
    return
  }
  ctx.body = account
})

export const swaggerPaths = {
  '/user_accounts/{id}': {
    get: {
      summary: 'Get user account by ID',
      security: [{ bearerAuth: [] }],
      parameters: [{ in: 'path', name: 'id', required: true, schema: { type: 'number' } }],
      responses: {
        200: {
          description: 'Account found',
          content: {
            'application/json': {
              schema: {
                type: 'object',
                properties: {
                  id: { type: 'number' },
                  balance: { type: 'string' },
                  currency: { type: 'string' },
                },
              },
            },
          },
        },
        404: { description: 'Account not found' },
      },
    },
  },
}

export default router
