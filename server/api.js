// dependencies
const restify = require('restify')
const request = require('request')
const mongo = require('mongodb')
const promise = require('promise')
const fs = require('fs')

// configuration
const config = require('../config')

// custom mongo helper
const mongoHelper = require('../mongoHelper')
const mongoer = Object.create(mongoHelper)
mongoer.init(mongo.MongoClient, config.mongoUrl)

// create api
const server = restify.createServer()
server.use(restify.acceptParser(server.acceptable))
server.use(restify.queryParser())
server.use(restify.bodyParser())

server.get('/api', function (req, res, next) {
    const page = req.params.page || 1
    const count = 100
    const skip = (page - 1) * count

    mongoer.open().then((db) => {
        mongoer.database = db

        return mongoer.database.collection('news').find({}).sort({ added: -1 }).skip(skip).limit(count).toArray()
    }).then((news) => {
        res.send(news)
        mongoer.close()

        return next()
    }).catch((error) => console.error(error))
});

server.get('/', function(req, res, next) {
    res.end(fs.readFileSync('./web/index.html', 'utf8'))
})

server.get(/\/web\/?.*/, restify.serveStatic({
    directory: __dirname + '/../',
}))

server.listen(8765, function () {
    console.log('%s listening at %s', server.name, server.url)
})
