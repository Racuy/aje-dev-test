import Decimal from 'decimal.js'
import { Transaction } from '../domain/Transaction'
import { ITransactionRepository, LockedAccount } from '../domain/ITransactionRepository'
import { Currency } from '../../../shared/domain/enums'

type PaymentInput = {
  payment_id: string
  user_id: number
  merchant_id: number
  amount: number
  currency: Currency
}

export class MakeTransaction {
  constructor(private readonly transactionRepo: ITransactionRepository) {}

  async execute(input: PaymentInput) {
    const { payment_id, user_id, merchant_id, amount, currency } = input


    if (!payment_id || !user_id || !amount || !currency || !merchant_id)
      throw Object.assign(new Error('Missing required fields'), { status: 400 })

    if (!Object.values(Currency).includes(currency))
      throw Object.assign(new Error('Invalid currency'), { status: 400 })

    if (merchant_id == user_id) {
      throw Object.assign(new Error('User and merchant ids must be different '), { status: 400 })
    }

    let decimalAmount: Decimal
    try {
      decimalAmount = new Decimal(amount)
    } catch {
      throw Object.assign(new Error('Invalid amount'), { status: 400 })
    }

    if (decimalAmount.lte(0))
      throw Object.assign(new Error('Amount must be greater than 0'), { status: 400 })

    if (decimalAmount.decimalPlaces() > 2)
      throw Object.assign(new Error('Amount cannot have more than 2 decimal places'), { status: 400 })

    const existing = await this.transactionRepo.findByPaymentId(payment_id)
    if (existing) return existing

    const transaction: Omit<Transaction, 'id' | 'created_at'> = {
      payment_id,
      user_id,
      merchant_id,
      amount: decimalAmount.toFixed(2),
      currency,
    }

    const result = await this.transactionRepo.runTransaction(async (ops) => {
      const userRaw = await ops.lockUserAccount(user_id)
      if (!userRaw) throw Object.assign(new Error('User account not found'), { status: 404 })
      const userAccount: LockedAccount = { id: userRaw.id, balance: userRaw.balance, currency: userRaw.currency }

      const merchantRaw = await ops.lockUserAccount(merchant_id)
      if (!merchantRaw) throw Object.assign(new Error('Merchant account not found'), { status: 404 })
      const merchantAccount: LockedAccount = { id: merchantRaw.id, balance: merchantRaw.balance, currency: merchantRaw.currency }

      if (userAccount.currency !== currency || merchantAccount.currency !== currency)
        throw Object.assign(new Error('Currency mismatch'), { status: 400 })

      const userBalance = new Decimal(userAccount.balance)

      if (userBalance.lessThan(decimalAmount))
        throw Object.assign(new Error('Insufficient balance'), { status: 422 })

      await ops.updateUserBalance(user_id, userBalance.minus(decimalAmount).toFixed(2))
      await ops.updateUserBalance(merchant_id, new Decimal(merchantAccount.balance).plus(decimalAmount).toFixed(2))

      return ops.saveTransaction(transaction)
    })

    if (!result) return this.transactionRepo.findByPaymentId(payment_id)
    return result
  }
}
