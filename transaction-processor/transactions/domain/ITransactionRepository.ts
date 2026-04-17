import { Transaction } from './Transaction'
import { Currency } from '../../../shared/domain/enums'

export type LockedAccount = {
  id: number
  balance: string
  currency: Currency
}

export interface TransactionOperations {
  lockUserAccount(id: number): Promise<LockedAccount | null>
  updateUserBalance(id: number, balance: string): Promise<void>
  saveTransaction(tx: Omit<Transaction, 'id' | 'created_at'>): Promise<Transaction>
}

export interface ITransactionRepository {
  findByPaymentId(payment_id: string): Promise<Transaction | null>
  runTransaction(callback: (ops: TransactionOperations) => Promise<Transaction>): Promise<Transaction | null>
}
