import Router from '@koa/router'
import { IUserAccountRepository } from '../../domain/IUserAccountRepository'
import createTestRouter, { swaggerPaths as createTestPaths } from './createTest'
import getByIdRouter, { swaggerPaths as getByIdPaths } from './getById'

export const swaggerPaths = {
  ...createTestPaths,
  ...getByIdPaths,
}

export default function createRouter(userAccountRepo: IUserAccountRepository) {
  const router = new Router()
  router.use(createTestRouter(userAccountRepo).routes())
  router.use(getByIdRouter(userAccountRepo).routes())
  return router
}
