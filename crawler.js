const request = require('request')
const cheerio = require('cheerio')
const moment = require('moment')
const mongo = require('mongodb')
const promise = require('promise')

const yleUlkomaatUrl = 'http://yle.fi/uutiset/18-34953'
const rootUrl = 'http://yle.fi'

const mongoUrl = 'mongodb://localhost:27017/jeltsin'
const mongoClient = mongo.MongoClient

const openMongoConnection = function() {
    return new Promise((resolve, reject) => {
        mongoClient.connect(mongoUrl, (err, db) => {
            if (err) {
                reject(err)
            } else {
                resolve(db)
            }
        })
    })
}

const closeMongoConnection = function(db) {
    if (db) {
        db.close()
    }
}

const insertAllData = function(newData) {
    let database = null
    let news = null
    let insertDataCount = 0

    openMongoConnection().then((db) => {
        database = db
        news = db.collection('news')

        let newUrls = []
        newData.forEach(newRow => {
            newUrls.push(newRow.url)
        })

        return news.find({url: {$in: newUrls}}).toArray()
    }).then((existingData) => {
        let insertData = []
        newData.forEach(newRow => {
            let found = false
            existingData.forEach(existingRow => {
                if (existingRow.url === newRow.url) {
                    found = true
                }
            })

            if (!found) {
                insertData.push(newRow)
            }
        })
        insertDataCount = insertData.length
        if (insertDataCount > 0) {
            return news.insertMany(insertData)
        }
        return new Promise((resolve) => resolve())
    }).then((res) => {
        closeMongoConnection(database)
        console.log(insertDataCount)
    }).catch((err) => {
        console.error(err)
    })
}

request(yleUlkomaatUrl, function (error, response, body) {
    if (error || response.statusCode != 200) {
        console.log(error)
    }

    const $ = cheerio.load(body)
    let data = []
    $('section.yle__newsList__sectionList__section').find('article').each((index, elem) => {
        const newsUrl = $(elem).find('a').attr('href')
        const title = $(elem).find('h1').text()
        const newsAddedRaw = $(elem).find('time').attr('datetime')
        data.push({
            url: rootUrl + newsUrl,
            title: title,
            added: moment(newsAddedRaw).toISOString(),
            created: moment().toISOString(),
        })
    })

    insertAllData(data)
})
