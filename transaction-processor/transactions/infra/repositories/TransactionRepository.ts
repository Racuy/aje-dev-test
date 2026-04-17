import { ITransactionRepository, LockedAccount, TransactionOperations } from '../../domain/ITransactionRepository'
import { Transaction } from '../../domain/Transaction'
import { TransactionSchema } from '../schemas/TransactionSchema'
import MySQLDatabase from '../../../../db/infra/MySQLDatabase'

export class TransactionRepository implements ITransactionRepository {
  async findByPaymentId(payment_id: string): Promise<Transaction | null> {
    const ds = await MySQLDatabase.getConnection()
    return ds.getRepository(TransactionSchema).findOne({ where: { payment_id } })
  }

  async runTransaction(callback: (ops: TransactionOperations) => Promise<Transaction>): Promise<Transaction | null> {
    const ds = await MySQLDatabase.getConnection()
    try {
      return await ds.transaction(async (manager) => {
        const ops: TransactionOperations = {
          async lockUserAccount(id): Promise<LockedAccount | null> {
            return manager.findOne<LockedAccount>('UserAccount', { where: { id }, lock: { mode: 'pessimistic_write' } })
          },
          async updateUserBalance(id, balance) {
            await manager.update('UserAccount', id, { balance })
          },
          async saveTransaction(tx) {
            const result = await manager.getRepository<Transaction>(TransactionSchema).save(tx)
            return {
              id: result.id,
              payment_id: result.payment_id,
              user_id: result.user_id,
              merchant_id: result.merchant_id,
              amount: result.amount,
              currency: result.currency,
              created_at: result.created_at,
            }
          },
        }
        return callback(ops)
      })
    } catch (err: any) {
      if (err.code === 'ER_DUP_ENTRY') return null
      throw err
    }
  }
}
