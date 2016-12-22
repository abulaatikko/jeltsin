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

        let insertData = []
        collection.find({}).toArray(function(error, currentData) {
            if (error) {
                console.log(error)
            }

            newData.forEach(newRow => {
                let found = false
                currentData.forEach(currentRow => {
                    if (currentRow.url === newRow.url) {
                        found = true
                    }
                })

                if (!found) {
                    insertData.push(newRow)
                }
            })

            if (insertData.length > 0) {
                collection.insertMany(insertData, function(error, result) {
                    if (error) {
                        console.log(error)
                    }
                    db.close()
                })
            } else {
                db.close()
            }
        })
    })
}

request(yleUlkomaatUrl, function (error, response, body) {
    if (!error && response.statusCode == 200) {
        const $ = cheerio.load(body)
        let data = []
        $('article').each((index, elem) => {
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
