import express from 'express'
import dotenv from 'dotenv'
import cors from 'cors'
import sequelize from './config/database.js'
import authRoute from './routes/auth.routes.js'
import addComponentRoute from './routes/add.component.routes.js'
import removeComponentRoute from './routes/remove.component.routes.js'
import transferComponentRoute from './routes/transfer.component.routes.js'
import getHomepageDataRouter from './routes/get.data.routes.js'
import { createServer } from 'node:http';
import SocketModule from './config/socket.config.js';
import taskRouter from './routes/task.routes.js'

const app = express();
const server = createServer(app)

// const socketModule=new SocketModule();
// socketModule.init(server);



sequelize.sync({ force: false }).then(() => {
    console.log('Database sunchronized')
}).catch((error) => console.log("Database sync error", error));

dotenv.config();
const port = process.env.PORT || 8000;


// middleware
app.use(cors());
app.use(express.json())
app.use(express.urlencoded({ extended: true })) // use express.urlencoded()



app.get('/', (req, res) => {
    res.send('Hello from server');
})


//routes
app.use('/auth', authRoute)
app.use('/add', addComponentRoute)
app.use('/remove', removeComponentRoute)
app.use('/transfer', transferComponentRoute)
app.use('/get', getHomepageDataRouter)
app.use('/task', taskRouter)


server.listen(port, '0.0.0.0', () => {
    console.log(`Server is listening on ${port}`);
})

// export default socketModule;