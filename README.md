# jeltsin
Yle uutiset link crawler

# USAGE

1. sudo service mongodb start
1. node crawler.js
1. mongo jeltsin

# TODO

* insert new news items to db
    * one query to check which of the urls are not in db
    * clean callback hell (promises?)
* cronjob
* show the 1000 newest news in web page
* support other categories (talous)
