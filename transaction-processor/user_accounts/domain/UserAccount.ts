import { Currency } from '../../../shared/domain/enums'

export type UserAccount = {
  id: number
  balance: string
  currency: Currency
}
