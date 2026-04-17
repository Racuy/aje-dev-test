import Router from '@koa/router'
import { CreateTestAccounts } from '../../application/CreateTestAccounts'
import { UserAccountRepository } from '../repositories/UserAccountRepository'

const router = new Router()

router.post('/createTest', async (ctx) => {
  const result = await new CreateTestAccounts(new UserAccountRepository()).execute()
  ctx.status = 201
  ctx.body = result
})

export const swaggerPaths = {
  '/createTest': {
    post: {
      summary: 'Create two test accounts with 1000 PEN each',
      security: [{ bearerAuth: [] }],
      responses: {
        201: {
          description: 'Accounts created',
          content: {
            'application/json': {
              schema: {
                type: 'object',
                properties: {
                  account1_id: { type: 'number' },
                  account2_id: { type: 'number' },
                },
              },
            },
          },
        },
      },
    },
  },
}

export default router
