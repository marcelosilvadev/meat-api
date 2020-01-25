import * as  mongoose from 'mongoose';

//Interface utilizada para delcarar os atributos dos nossos documentos
export interface User extends mongoose.Document {
    name: string
    email: string
    password: string
}

//Schema informar o mongoose quais são os metadatas dos nossos documentos
const userSchema = new mongoose.Schema({
    name: {
        type: String
    },
    email: {
        type: String,
        unique: true
    },
    password: {
        type: String,
        select: false
    }
})

//Model é o responsavel por manipular os dados do mongoDB
export const User = mongoose.model<User>('User', userSchema)