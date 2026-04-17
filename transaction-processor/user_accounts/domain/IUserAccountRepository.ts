import { UserAccount } from './UserAccount'

export interface IUserAccountRepository {
  save(account: Omit<UserAccount, 'id'>): Promise<UserAccount>
  findById(id: number): Promise<UserAccount | null>
}
