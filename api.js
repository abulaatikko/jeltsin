// dependencies
const restify = require('restify')
const request = require('request')
const mongo = require('mongodb')
const promise = require('promise')

// configuration
const config = require('./config')

// custom mongo helper
const mongoHelper = require('./mongoHelper')
const mongoer = Object.create(mongoHelper)
mongoer.init(mongo.MongoClient, config.mongoUrl)

// create api
var server = restify.createServer()
server.use(restify.acceptParser(server.acceptable))
server.use(restify.queryParser())
server.use(restify.bodyParser())
 
server.get('/api', function (req, res, next) {
    mongoer.open().then((db) => {
        return db.collection('news').find({}).toArray()
    }).then((news) => {
        res.send(news)
        return next()
    }).catch((error) => console.err(error))
});

server.listen(8765, function () {
    console.log('%s listening at %s', server.name, server.url);
});
