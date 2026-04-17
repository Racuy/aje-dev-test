import Router from '@koa/router'
import { ITransactionRepository } from '../../domain/ITransactionRepository'
import createMakeTransactionRouter, { swaggerPaths as makeTransactionPaths } from './makeTransaction'

export const swaggerPaths = { ...makeTransactionPaths }

export default function createRouter(transactionRepo: ITransactionRepository) {
  const router = new Router()
  router.use(createMakeTransactionRouter(transactionRepo).routes())
  return router
}
