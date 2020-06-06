import * as  mongoose from 'mongoose';
import { validateCPF } from '../../common/validators';
import * as bcrypt from 'bcrypt'
import { environment } from '../../common/environment'


//Interface utilizada para delcarar os atributos dos nossos documentos
export interface User extends mongoose.Document {
  name: string
  email: string
  password: string
}

//Schema informar o mongoose quais são os metadatas dos nossos documentos
const userSchema = new mongoose.Schema({
  name: {
    type: String,
    maxlength: 80,
    minlength: 3,
    required: true
  },
  email: {
    type: String,
    unique: true,
    match: /^(([^<>()\[\]\\.,;:\s@"]+(\.[^<>()\[\]\\.,;:\s@"]+)*)|(".+"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/,
    required: true
  },
  password: {
    type: String,
    select: false,
    required: true
  },
  gender: {
    type: String,
    required: false,
    enum: ['Male', 'Female']
  },
  cpf: {
    type: String,
    required: false,
    validate: {
      validator: validateCPF,
      message: '{PATH}: Invalid CPF({VALUE})'
    }
  }
})

const hashPassword = (obj, next) => {
  bcrypt.hash(obj.password, environment.security.saltRounds)
    .then(hash => {
      obj.password = hash
      next()
    }).catch(next)
}

const saveMiddleware = function (next) {
  //mongoose não consegue interpretar arrow funtions
  //this representa o documento
  const user: User = this
  if (!user.isModified('password')) {
    next()
  } else {
    hashPassword(user, next)
  }
}

const updateMiddleware = function (next) {
  //this representa o user buscado no methodo
  if (!this.getUpdate().password) {
    next()
  } else {
    hashPassword(this.getUpdate(), next)
  }
}

userSchema.pre('save', saveMiddleware)
userSchema.pre('findOneAndUpdate', updateMiddleware)
userSchema.pre('update', updateMiddleware)

//Model é o responsavel por manipular os dados do mongoDB
export const User = mongoose.model<User>('User', userSchema)