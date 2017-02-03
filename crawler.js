// dependencies
const request = require('request')
const cheerio = require('cheerio')
const moment = require('moment')
const mongo = require('mongodb')
const promise = require('promise')

// configuration
const config = require('./config')

// custom mongo helper
const mongoHelper = require('./mongoHelper')
const mongoer = Object.create(mongoHelper)
mongoer.init(mongo.MongoClient, config.mongoUrl)

const insertData = function(newData) {
    let insertDataCount = 0

    mongoer.open().then((db) => {
        mongoer.database = db

        let newUrls = []
        newData.forEach(newRow => {
            newUrls.push(newRow.url)
        })

        return mongoer.database.collection('news').find({url: {$in: newUrls}}).toArray()
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
            return mongoer.database.collection('news').insertMany(insertData)
        }

        return new Promise((resolve) => resolve())
    }).then((res) => {
        mongoer.close()
        console.log(insertDataCount)
    }).catch((err) => {
        console.error(err)
    })
}

// app
config.crawledPages.forEach(crawledPage => {
    request(config.rootUrl + crawledPage, function (error, response, body) {
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
                url: config.rootUrl + newsUrl,
                title: title,
                added: moment(newsAddedRaw).toISOString(),
                created: moment().toISOString(),
            })
        })

        insertData(data)
    })
})
