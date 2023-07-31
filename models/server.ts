import express, {Application} from 'express';
import userRoutes from '../routes/person.routes';
import  auth  from "../routes/auth.routes";
import cors from 'cors';
import db from '../db/connection';

class Server{
    private app: Application;
    private port: string;
    private apiPaths = {
        profesor: '/api/professor/',
        authPath: '/api/auth/',
        student: '/api/student/',
        person: '/api/person/'
    }
    constructor(){
        this.app = express();
        this.port = process.env.PORT || '8080';
        //configurar mis rutas
        this.dbConnection();
        this.middlewares();
        this.routes();
    }

    async dbConnection(){
        try{
            //verify connection
            await db.authenticate();
            //sync the models
            await db.sync({force: true});
            console.log('DB online')
        }catch(error){
            throw error;
        }
    }

    middlewares(){
        //CORS
        this.app.use( cors());
        //lectura del body
        this.app.use( express.json());
        //carpeta publica
        this.app.use( express.static('public'));
    }

    routes(){

        this.app.use( this.apiPaths.authPath, auth );
        this.app.use( this.apiPaths.person, userRoutes );
    }

    listen(){
        this.app.listen(this.port, ()=>{
            console.log(`Server is running on: ${this.port}`);
        })
    }
}

export default Server;