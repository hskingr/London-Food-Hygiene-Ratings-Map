const mongoose = require('mongoose')

const connectToDB = async () => {
    try {
        mongoose.connect('mongodb://127.0.0.1:27017/food-hygiene-ratings-london', {
            useNewUrlParser: true,
            useCreateIndex: true,
            useFindAndModify: false,
            useUnifiedTopology: true
        })

        const db = mongoose.connection

        db.on('error', (x) => {
            console.log(x)
        })

        db.once('open', () => {
            console.log(`connected`)
          });
    } catch (error) {
        console.log(error)
    }
}
connectToDB()