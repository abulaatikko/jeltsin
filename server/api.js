// dependencies
const restify = require('restify')
const request = require('request')
const mongo = require('mongodb')
const promise = require('promise')
const moment = require('moment')
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
    const month = req.params.month || moment().year() + '-' + moment().month()

    mongoer.open().then((db) => {
        mongoer.database = db

        return mongoer.database.collection('news').find({
            added: {
                '$gte': moment(month + '-01').format(),
                '$lt': moment(month + '-' + moment(month).daysInMonth()).format()
            }
        }).sort({ added: -1 }).toArray()
    }).then((news) => {
        res.send(news)
        mongoer.close()

        return next()
    }).catch((error) => console.error(error))
});

server.get(/\/web\/?.*/, restify.serveStatic({
    directory: __dirname + '/../',
}))

server.get('/.*', function(req, res, next) {
    res.end(fs.readFileSync('./web/index.html', 'utf8'))
})

server.listen(8765, function () {
    console.log('%s listening at %s', server.name, server.url)
})
