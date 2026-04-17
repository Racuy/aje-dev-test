import { EntitySchema } from 'typeorm'
import { Transaction } from '../../domain/Transaction'
import { UserAccount } from '../../../user_accounts/domain/UserAccount'

type TransactionEntity = Transaction & {
  user: UserAccount
  merchant: UserAccount
}

export const TransactionSchema = new EntitySchema<TransactionEntity>({
  name: 'Transaction',
  tableName: 'transactions',
  columns: {
    id: { type: Number, primary: true, generated: 'increment', nullable: false },
    payment_id: { type: String, unique: true, nullable: false },
    user_id: { type: Number, nullable: false },
    merchant_id: { type: Number, nullable: false },
    amount: { type: 'decimal', precision: 18, scale: 2, nullable: false },
    currency: { type: String, nullable: false },
    created_at: { type: Date, createDate: true, nullable: false },
  },
  relations: {
    user: {
      type: 'many-to-one',
      target: 'UserAccount',
      joinColumn: { name: 'user_id' },
    },
    merchant: {
      type: 'many-to-one',
      target: 'UserAccount',
      joinColumn: { name: 'merchant_id' },
    },
  },
})
