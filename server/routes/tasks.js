const store = require('../store')
const Router = require('@koa/router')

const router = new Router({ prefix: '/api/tasks' })

router.get('/', async (ctx) => {
  ctx.status = 501
})

router.post('/', async (ctx) => {
  
  if (ctx.request.body.title!='')
  {
    await store.addTask(ctx.request.body)
    ctx.status = 200
  }
  else
  {
    ctx.status = 400
  }


  
})

router.delete('/', async (ctx) => {
  ctx.status = 501
})

module.exports = router