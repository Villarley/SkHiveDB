import express, {Application} from 'express';
import cors from 'cors';
//Routes:
import userRoutes from '../routes/person.routes';
import  authRoutes  from "../routes/auth.routes";
import classRoutes from "../routes/class.routes"
import activyRoutes from "../routes/activities.routes";
import db from '../db/connection';
import { configureAssociations, initializeModels } from './Classroom/associations';

class Server{
    private app: Application;
    private port: string;
    private apiPaths = {
        profesor: '/api/professor/',
        authPath: '/api/auth/',
        student: '/api/student/',
        person: '/api/person/',
        classes:'/api/classes/',
        activities:'/api/activities/',
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
            await initializeModels();
            await configureAssociations();
            await db.sync({force: true});
            //Configuring associations
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

        this.app.use( this.apiPaths.authPath, authRoutes );
        this.app.use( this.apiPaths.person, userRoutes );
        this.app.use( this.apiPaths.classes, classRoutes ); 
        this.app.use( this.apiPaths.activities, activyRoutes ); 

    }

    listen(){
        this.app.listen(this.port, ()=>{
            console.log(`Server is running on: ${this.port}`);
        })
    }
}

export default Server;