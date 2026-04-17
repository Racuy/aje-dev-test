import Router from '@koa/router'
import { MakeTransaction } from '../../application/MakeTransaction'
import { ITransactionRepository } from '../../domain/ITransactionRepository'
import { Currency } from '../../../../shared/domain/enums'

export const swaggerPaths = {
  '/transactions/payment': {
    post: {
      summary: 'Process a QR payment',
      security: [{ bearerAuth: [] }],
      requestBody: {
        required: true,
        content: {
          'application/json': {
            schema: {
              type: 'object',
              required: ['user_id', 'amount', 'currency', 'merchant_id', 'payment_id'],
              properties: {
                user_id: { type: 'number' },
                amount: { type: 'number' },
                currency: { type: 'string', enum: ['PEN', 'USD'] },
                merchant_id: { type: 'number' },
                payment_id: { type: 'string' },
              },
            },
          },
        },
      },
      responses: {
        200: { description: 'Payment processed' },
        400: { description: 'Validation error' },
        404: { description: 'Account not found' },
        422: { description: 'Insufficient balance' },
      },
    },
  },
}

export default function createRouter(transactionRepo: ITransactionRepository) {
  const router = new Router()

  router.post('/payment', async (ctx) => {
    const { user_id, amount, currency, merchant_id, payment_id } = ctx.request.body as any
    const result = await new MakeTransaction(transactionRepo).execute({
      payment_id: String(payment_id),
      user_id: Number(user_id),
      merchant_id: Number(merchant_id),
      amount: Number(amount),
      currency: currency as Currency,
    })
    ctx.body = { ...result }
  })

  return router
}
