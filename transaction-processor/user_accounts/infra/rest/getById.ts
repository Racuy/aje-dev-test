import Router from '@koa/router'
import { GetUserAccountById } from '../../application/GetUserAccountById'
import { IUserAccountRepository } from '../../domain/IUserAccountRepository'

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
                  balance: { type: 'number' },
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

export default function createRouter(userAccountRepo: IUserAccountRepository) {
  const router = new Router()

  router.get('/:id', async (ctx) => {
    const account = await new GetUserAccountById(userAccountRepo).execute(Number(ctx.params.id))
    ctx.body = { ...account }
  })

  return router
}
