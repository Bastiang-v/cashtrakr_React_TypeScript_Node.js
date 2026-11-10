import express from 'express' 
import colors from 'colors'
import morgan from 'morgan'
import {db} from './config/db'


async function connectDB() {
    try{
await db.authenticate()
db.sync()
console.log(colors.blue.bold('Conexion Exitosa a la db'))
    }catch(error){
//console.log(error)
console.log(colors.red.bold('Fallo la conexion'))
    }
}
connectDB()
const app = express()

app.use(morgan('dev'))

app.use(express.json())



export default app