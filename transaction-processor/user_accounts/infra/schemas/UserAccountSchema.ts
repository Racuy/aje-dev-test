import { EntitySchema } from 'typeorm'
import { UserAccount } from '../../domain/UserAccount'

export const UserAccountSchema = new EntitySchema<UserAccount>({
  name: 'UserAccount',
  tableName: 'user_accounts',
  columns: {
    id: { type: Number, primary: true, generated: 'increment', nullable: false },
    balance: { type: 'decimal', precision: 18, scale: 2, nullable: false },
    currency: { type: String, nullable: false },
  },
})
