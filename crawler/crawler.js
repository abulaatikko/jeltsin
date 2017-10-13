// dependencies
const request = require('request')
const cheerio = require('cheerio')
const moment = require('moment')
const mongo = require('mongodb')
const promise = require('promise')

// configuration
const config = require('../config')

// custom mongo helper
const mongoHelper = require('../mongoHelper')
const mongoer = Object.create(mongoHelper)
mongoer.init(mongo.MongoClient, config.mongoUrl)

const insertData = function(newData) {
    const newUrls = newData.map(newRow => newRow.url)
    let insertDataCount = 0

    mongoer.open().then((db) => {
        mongoer.database = db

        return mongoer.database.collection('news').find({url: {$in: newUrls}}).toArray()
    }).then((existingData) => {
        const existingUrls = existingData.map(existingRow => existingRow.url)
        const insertData = newData.filter(newRow => !existingUrls.includes(newRow.url))

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
