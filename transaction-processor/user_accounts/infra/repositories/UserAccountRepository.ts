import { IUserAccountRepository } from '../../domain/IUserAccountRepository'
import { UserAccount } from '../../domain/UserAccount'
import { UserAccountSchema } from '../schemas/UserAccountSchema'
import MySQLDatabase from '../../../../db/infra/MySQLDatabase'

export class UserAccountRepository implements IUserAccountRepository {
  async save(account: Omit<UserAccount, 'id'>): Promise<UserAccount> {
    const ds = await MySQLDatabase.getConnection()
    return ds.getRepository(UserAccountSchema).save(account)
  }

  async findById(id: number): Promise<UserAccount | null> {
    const ds = await MySQLDatabase.getConnection()
    return ds.getRepository(UserAccountSchema).findOne({ where: { id } })
  }
}
