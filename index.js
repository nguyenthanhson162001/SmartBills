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

app.use("/public", express.static('./public'));
app.set('view engine', 'ejs');

// parse application/json
app.use(express.json()) // for parsing application/json
app.use(express.urlencoded({
    extended: true
}))

app.use(morgan('tiny'))
router(app)

app.listen(port, () => console.log(`Server started with http://localhost:${port}`))