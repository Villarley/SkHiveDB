import dotenv from 'dotenv';
import Server from './models/server';
dotenv.config();

//config del dotenv
const server = new Server();

server.listen();