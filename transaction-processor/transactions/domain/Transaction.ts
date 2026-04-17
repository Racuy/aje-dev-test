import { Currency } from '../../../shared/domain/enums'

export type Transaction = {
  id: number
  payment_id: string
  user_id: number
  merchant_id: number
  amount: string
  currency: Currency
  status: string
  created_at: Date
}
