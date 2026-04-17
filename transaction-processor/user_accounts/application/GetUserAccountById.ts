import { IUserAccountRepository } from '../domain/IUserAccountRepository'
import { UserAccount } from '../domain/UserAccount'

export class GetUserAccountById {
  constructor(private readonly repo: IUserAccountRepository) {}

  async execute(id: number): Promise<UserAccount> {
    const raw = await this.repo.findById(id)
    if (!raw) throw Object.assign(new Error('Account not found'), { status: 404 })
    return { id: raw.id, balance: raw.balance, currency: raw.currency }
  }
}
