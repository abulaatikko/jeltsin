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

// todo:
// default config
// ohjeisiin pm2 start api.js --name "jeltsin-api"

var server = restify.createServer()
server.use(restify.acceptParser(server.acceptable))
server.use(restify.queryParser())
server.use(restify.bodyParser())
 
server.get('/api', function (req, res, next) {
    mongoer.open().then((db) => {console.log(db)
        //res.send(db['news'].find({}).toString())
        return next()
    })
});
 
server.listen(8088, function () {
      console.log('%s listening at %s', server.name, server.url);
});
