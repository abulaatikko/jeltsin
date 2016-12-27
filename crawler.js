// dependencies
const request = require('request')
const cheerio = require('cheerio')
const moment = require('moment')
const mongo = require('mongodb')
const promise = require('promise')

// configuration
const rootUrl = 'http://yle.fi'
const crawledPages = ['/uutiset/18-34953']
const mongoUrl = 'mongodb://localhost:27017/jeltsin'

// mongo helper
const Mongoer = {
    database: null,
    collections: [],

    init(client, url) {
        this.client = client
        this.url = url
    },

    open() {
         return new Promise((resolve, reject) => {
            this.client.connect(this.url, (err, db) => {
                if (err) {
                    reject(err)
                } else {
                    resolve(db)
                }
            })
        })
    },

    close() {
        if (this.database) {
            this.database.close()
        }
    },
}

const insertData = function(newData) {
    let insertDataCount = 0

    const mongoer = Object.create(Mongoer)
    mongoer.init(mongo.MongoClient, mongoUrl)

    mongoer.open().then((db) => {
        mongoer.database = db
        mongoer.collections['news'] = mongoer.database.collection('news')

        let newUrls = []
        newData.forEach(newRow => {
            newUrls.push(newRow.url)
        })

        return mongoer.collections['news'].find({url: {$in: newUrls}}).toArray()
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
            return mongoer.collections['news'].insertMany(insertData)
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
crawledPages.forEach(crawledPage => {
    request(rootUrl + crawledPage, function (error, response, body) {
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

        insertData(data)
    })
})
