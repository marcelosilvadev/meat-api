import { Router } from '../../common/router'
import * as restify from 'restify'
import { NotFoundError } from 'restify-errors'
import { User } from './users.model'

class UsersRouter extends Router {

  constructor() {
    super()
    this.on('beforeRender', document => {
      //delete document.password
      document.password = undefined
    })
  }

  applyRoutes(application: restify.Server) {

    application.get('/users', (req, resp, next) => {
      User.find()
        .then(this.render(resp, next))
        .catch(next)
    })

    application.get('/users/:id', (req, resp, next) => {
      User.findById(req.params.id)
        .then(this.render(resp, next))
        .catch(next)
    })

    application.post('/users', (req, resp, next) => {
      let user = new User(req.body)
      user.save()
        .then(this.render(resp, next))
        .catch(next)
    })

    application.put('/users/:id', (req, resp, next) => {
      //Utiliza-se overwrite para indicar o mongoose se faz o update completo do document ou parcialmente
      const options = { runValidators: true, overwrite: true }
      User.update({ _id: req.params.id }, req.body, options)
        .exec()
        .then(result => {
          if (result.n) {
            return User.findById(req.params.id) as any
          } else {
            throw new NotFoundError('Documento não encontrado')
          }
        })
        .then(this.render(resp, next))
        .catch(next)
    })

    application.patch('/users/:id', (req, resp, next) => {
      const options = { runValidators: true, new: true }
      User.findByIdAndUpdate(req.params.id, req.body, options)
        .then(user => {
          if (user) {
            resp.json(user)
            return next()
          }
          resp.send(404)
          return next()
        })
        .catch(next)
    })

    application.del('users/:id', (req, resp, next) => {
      User.remove({ _id: req.params.id })
        .exec()
        .then((cmdResult: any) => {
          if(cmdResult.result.n){
            resp.send(204)
          }else {
            throw new NotFoundError('Documento não encontrado')
          }
        })
        .catch(next)
    })

  }
}

export const usersRouter = new UsersRouter()