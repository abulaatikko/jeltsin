# JELTSIN

Yle uutiset link crawler and API

## INSTALLATION

1. `git clone https://github.com/lassiheikkinen/jeltsin`; cd jeltsin
1. `yarn`
1. `cp config.sample config; vim config`

## CRAWLER USAGE

1. `sudo service mongodb start`
1. `node crawler.js`
1. `mongo jeltsin`

## API USAGE

1. `pm2 start api.js --name "jeltsin-api"`
1. `curl localhost:8765/api`
1. <http://jeltsin.pulu.org/api>

## TIPS

Fetch items between two dates:

````
db.news.find({ added: { $gte: "2016-09-01T00:00:00.000Z", $lt: "2017-01-01T00:00:00.000Z" } }, {url: 1, title: 1, added: 1,_id: 0}).sort({added: -1});
````

## TODO

* show the 1000 newest news in web page (react, preact, vue?)
    * http://www.react.express/react_setup
* pagination
* request a key to make the app remember your last opened link
* use hapi
* use <http://yle.fi/uutiset/rss>
* <https://www.npmjs.com/package/node-fetch>

