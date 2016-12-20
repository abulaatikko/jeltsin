let request = require('request')
let cheerio = require('cheerio')
let moment = require('moment')

const yleUlkomaatUrl = 'http://yle.fi/uutiset/18-34953'

request(yleUlkomaatUrl, function (error, response, body) {
    if (!error && response.statusCode == 200) {
        const $ = cheerio.load(body)
        $('article').each((index, elem) => {
            const newsUrl = $(elem).find('a').attr('href')
            const title = $(elem).find('h1').text()
            const newsAddedRaw = $(elem).find('time').attr('datetime')
            console.log(newsUrl, title, moment(newsAddedRaw).toISOString(), moment().toISOString())
        })
    }
})
