const express = require('express');
const app = express();
const moongoose = require('mongoose');
var cors = require('cors')

//Import Routes
const authRoute = require('./routes/auth');

//Import DB
moongoose.connect('mongodb+srv://minhquanghaiquan:Luckybear123456@cluster0-gmsqv.mongodb.net/instagram', 
    {useNewUrlParser: true,  useUnifiedTopology: true},
    () => console.log('connected to db')
);

//Middleware
app.use(cors())
app.use(express.json());


//Route Middlewares
app.use('/api/user', authRoute);

const router = require('./routes/auth');







app.listen(8080, () => console.log('server is running...'));