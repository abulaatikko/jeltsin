# JELTSIN

Yle uutiset link crawler

## USAGE

1. sudo service mongodb start
1. node crawler.js
1. mongo jeltsin

Fetch items between two dates:

````
db.news.find({ added: { $gte: "2016-09-01T00:00:00.000Z", $lt: "2017-01-01T00:00:00.000Z" } }, {url: 1, title: 1, added: 1,_id: 0}).sort({added: -1});
````

## TODO

* import React from 'react'
* use http://yle.fi/uutiset/rss
* move `insertData()` behind mongoer and use update, upsert
* show the 1000 newest news in web page (preact?)

