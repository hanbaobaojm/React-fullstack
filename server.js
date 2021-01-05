/*The model to begin the server*/
require('dotenv').config();
const mongoose = require('mongoose');
const express = require('express');
const app = express();
const cors = require('cors');

app.use(cors());
// 声明使用静态中间件
app.use(express.static('public'));
// 声明使用解析post请求的中间件
app.use(express.urlencoded({extended: true}));// 请求体参数是: name=tom&pwd=123
app.use(express.json()); // 请求体参数是json结构: {name: tom, pwd: 123}
// 声明使用解析cookie数据的中间件
const cookieParser = require('cookie-parser');
app.use(cookieParser());
// 声明使用路由器中间件
const indexRouter = require('./routers');
app.use('/', indexRouter);
app.use(express.static('build'));

const url = process.env.MONGODB_URI;
const PORT = process.env.PORT||3001;
console.log('connecting to', url);
mongoose.connect(url, { useNewUrlParser: true, useUnifiedTopology: true, useFindAndModify: false, useCreateIndex: true })
    .then(result => {
        console.log('connected to MongoDB');
        app.listen(PORT, () => {
            console.log(`Server running on port ${PORT}`)
        });
    })
    .catch((error) => {
        console.log('error connecting to MongoDB:', error.message)
    });