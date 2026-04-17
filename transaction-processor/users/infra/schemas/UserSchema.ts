import { EntitySchema } from 'typeorm'
import { User } from '../../domain/User'

export const UserSchema = new EntitySchema<User>({
  name: 'User',
  tableName: 'users',
  columns: {
    id: { type: Number, primary: true, generated: 'increment', nullable: false },
    name: { type: String, nullable: false },
  },
})
