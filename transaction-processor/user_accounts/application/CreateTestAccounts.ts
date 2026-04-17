import { IUserAccountRepository } from '../domain/IUserAccountRepository'
import { Currency } from '../../../shared/domain/enums'

export class CreateTestAccounts {
  constructor(private readonly repo: IUserAccountRepository) {}

  async execute() {
    const [account1, account2] = await Promise.all([
      this.repo.save({ balance: '1000.00', currency: Currency.PEN }),
      this.repo.save({ balance: '1000.00', currency: Currency.PEN }),
    ])
    return { account1_id: account1.id, account2_id: account2.id }
  }
}
