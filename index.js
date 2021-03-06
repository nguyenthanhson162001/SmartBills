const express = require('express')
const cors = require('cors')
const app = express()
const router = require('./router')
const morgan = require('morgan')
const port = process.env.port || 3001


// connect DB
require('./config/db/mongo').connect()

// config Enable All CORS Requests
app.use(cors())
// app.use(function (req, res, next) {
//     res.header("Access-Control-Allow-Origin", "*");
//     res.header("Access-Control-Allow-Methods", "GET, PUT, POST, DELETE, PATH");
//     res.header("Access-Control-Allow-Headers", "Origin, X-Requested-With, Content-Type, Accept");
//     next();
// });
app.use("/public", express.static('./public'));
app.set('view engine', 'ejs');

// parse application/json
app.use(express.json({ limit: '50mb' })) // for parsing application/json
app.use(express.urlencoded({
    extended: true, limit: '50mb'
}))
// bodyParser.json({ limit: "50mb" })

app.use(morgan('tiny'))
router(app)

app.listen(port, () => console.log(`Server started with http://localhost:${port}`))