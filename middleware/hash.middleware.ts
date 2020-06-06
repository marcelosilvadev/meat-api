import * as bcrypt from 'bcrypt'
import { environment } from '../common/environment'
import { User } from '../src/users/users.model'

const hashPassword = (obj, next) => {
    bcrypt.hash(obj.password, environment.security.saltRounds)
      .then(hash => {
        obj.password = hash
        next()
      }).catch(next)
  }
  
export const saveMiddleware = function (next) {
    //mongoose não consegue interpretar arrow funtions
    //this representa o documento
    const user: User = this
    if (!user.isModified('password')) {
      next()
    } else {
      hashPassword(user, next)
    }
  }
  
export const updateMiddleware = function (next) {
    //this representa o user buscado no methodo
    const user: User = this
    if (!this.getUpdate().password) {
      next()
    } else {
      hashPassword(this.getUpdate(), next)
    }
  }