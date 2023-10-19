const express = require('express')
const cors = require('cors')
const bodyParser = require('body-parser')
require('dotenv').config();
const Port = process.env.PORT;
const dbConnect = require('./config/db')
const handleSocket = require('./controllers/socketController')
const userRouter = require('./routes/user.route')
const productRouter = require('./routes/product.route')
const app = express();
const http = require('http');
const server = http.createServer(app);
const io = require('socket.io')(server, {
    pingTimeout: 60000,
    cors: {
        origin: '*',
    },
});
io.on('connection', (socket) => {
    console.log('CONNECTED________SOCKET');
    handleSocket.handleSetup(socket);
    handleSocket.handleProduct(socket);
});
dbConnect();
app.use(cors())
app.use(bodyParser.json())
app.use("/api/user", userRouter)
app.use("/api/product", productRouter)
app.listen(Port, () => {
    console.log('Server is running : ', Port);
})