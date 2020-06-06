import * as restify from 'restify'
import { BadRequestError } from 'restify-errors'

//Criação de sua própria configuraçãod e Content Type

const mpContentType = 'application/merge-patch+json'

export const mergePatchBodyParser = (req: restify.Request, resp: restify.Response, next: restify.Next) => {
    if (req.getContentType() === mpContentType && req.method === 'PATCH') {
        (<any>req).rawbody = req.body
        try {
            req.body = JSON.parse(req.body)
        } catch (err) {
            return next(new BadRequestError(`Invalid content: ${err.message}`))
        }
    }
    return next()
}