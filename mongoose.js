const mongoose = require('mongoose')

    mongoose.connect('mongodb://localhost:27017/food-hygiene-ratings-london', {
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
    




