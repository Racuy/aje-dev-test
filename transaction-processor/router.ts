import Router from '@koa/router'
import { UserAccountRepository } from './user_accounts/infra/repositories/UserAccountRepository'
import { TransactionRepository } from './transactions/infra/repositories/TransactionRepository'
import createUserAccountRouter, { swaggerPaths as userAccountPaths } from './user_accounts/infra/rest/router'
import createTransactionRouter, { swaggerPaths as transactionPaths } from './transactions/infra/rest/router'

const userAccountRepo = new UserAccountRepository()
const transactionRepo = new TransactionRepository()

const router = new Router()
router.use('/user_accounts', createUserAccountRouter(userAccountRepo).routes())
router.use('/transactions', createTransactionRouter(transactionRepo).routes())

export const swaggerPaths = {
  ...userAccountPaths,
  ...transactionPaths,
}

export default router
