import * as restify from 'restify'
import * as  mongoose from 'mongoose';
import { environment } from '../common/environment'
import { Router } from '../common/router'

export class Server {

    application: restify.Server;

    initializeDb(): mongoose.MongooseThenable {
        (mongoose as any).Promise = global.Promise
        return mongoose.connect(environment.db.url, {
            useMongoClient: true
        })
    }

    //Criado método para inicialização da API
    initRoutes(routers: Router[]): Promise<any> {
        return new Promise((resolve, reject) => {
            try {

                this.application = restify.createServer({
                    name: 'meat-api',
                    version: '1.0.0'
                })

                this.application.use(restify.plugins.queryParser())
                this.application.use(restify.plugins.bodyParser())

                //routes
                for (let router of routers) {
                    router.applyRoutes(this.application);
                }

                this.application.listen(environment.server.port, () => {
                    resolve(this.application)
                })

            } catch (error) {
                reject(error);
            }
        })
    }

    //Criado método para iniciar as rotas na inicialização da API
    bootstrap(routers: Router[] = []): Promise<Server> {
        return this.initializeDb().then(() => {
            return this.initRoutes(routers).then(() => this);
        })
    }
}