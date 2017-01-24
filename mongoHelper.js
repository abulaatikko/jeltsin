const mongoHelper = {
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

module.exports = mongoHelper
