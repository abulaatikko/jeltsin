let request = require('request')
let cheerio = require('cheerio')
let moment = require('moment')
let mongo = require('mongodb')

let mongoClient = mongo.MongoClient

const yleUlkomaatUrl = 'http://yle.fi/uutiset/18-34953'
const rootUrl = 'http://yle.fi'
const mongoUrl = 'mongodb://localhost:27017/jeltsin'

let insertAllData = function(newData) {
    mongoClient.connect(mongoUrl, function(error, db) {
        if (error) {
            console.log(error)
        }

        let collection = db.collection('news')

        let newUrls = []
        newData.forEach(newRow => {
            newUrls.push(newRow.url)
        })

        let insertData = []
        collection.find({url: {$in: newUrls}}).toArray(function(error, existingData) {
            if (error) {
                console.log(error)
            }

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

            const insertDataCount = insertData.length
            if (insertDataCount > 0) {
                collection.insertMany(insertData, function(error, result) {
                    if (error) {
                        console.log(error)
                    }

                    db.close()
                    console.log(insertDataCount)
                })
            } else {
                db.close()
                console.log(insertDataCount)
            }
        })
    })
}

request(yleUlkomaatUrl, function (error, response, body) {
    if (!error && response.statusCode == 200) {
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
    }
})
