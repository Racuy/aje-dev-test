import { EntitySchema } from 'typeorm'
import { Account } from '../../domain/Account'

export const AccountSchema = new EntitySchema<Account>({
  name: 'Account',
  tableName: 'accounts',
  columns: {
    id: { type: Number, primary: true, generated: 'increment', nullable: false },
    user_id: { type: Number, nullable: false },
    balance: { type: 'decimal', precision: 18, scale: 2, nullable: false },
    currency: { type: String, nullable: false },
  },
})
