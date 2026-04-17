import { EntitySchema } from 'typeorm'
import { Transaction } from '../../domain/Transaction'

export const TransactionSchema = new EntitySchema<Transaction>({
  name: 'Transaction',
  tableName: 'transactions',
  columns: {
    id: { type: Number, primary: true, generated: 'increment', nullable: false },
    payment_id: { type: String, unique: true, nullable: false },
    user_id: { type: Number, nullable: false },
    merchant_id: { type: Number, nullable: false },
    amount: { type: 'decimal', precision: 18, scale: 2, nullable: false },
    currency: { type: String, nullable: false },
    status: { type: String, default: 'pending', nullable: false },
    created_at: { type: Date, createDate: true, nullable: false },
  },
})
