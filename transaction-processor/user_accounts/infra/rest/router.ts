import Router from '@koa/router'
import createTestRouter, { swaggerPaths as createTestPaths } from './createTest'
import getByIdRouter, { swaggerPaths as getByIdPaths } from './getById'

const router = new Router()

router.use(createTestRouter.routes())
router.use(getByIdRouter.routes())

export const swaggerPaths = {
  ...createTestPaths,
  ...getByIdPaths,
}

export default router
