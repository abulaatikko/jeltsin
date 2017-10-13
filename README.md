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

## BACKEND USAGE

1. `pm2 start server/api.js --name "jeltsin-server"`
1. `curl localhost:8765/api`
1. <http://jeltsin.pulu.org/api>

## FRONTEND USAGE

1. npm run build
1. <http://jeltsin.pulu.org/>

## TIPS

Fetch items between two dates:

````
db.news.find({ added: { $gte: "2016-09-01T00:00:00.000Z", $lt: "2017-01-01T00:00:00.000Z" } }, { url: 1, title: 1, added: 1,_id: 0 }).sort({ added: -1 });
````

## TODO

* pagination
* request a key to make the app remember your last opened link
* use hapi
* use npm5 instead of yarn
* use <http://yle.fi/uutiset/rss>
* <https://www.npmjs.com/package/node-fetch>

