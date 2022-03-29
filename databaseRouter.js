const Restaurant = require('./models/restaurant.js')
const express = require('express')
const router = new express.Router()

router.get('/api', async (req, res) => {
  console.log('I received a GET request for data')
  try {
    const data = await Restaurant.find({})
    res.send(data)
  } catch (error) {
    console.log(error)
  }
})

router.get('/apiOps', async (req, res) => {
  console.log('I received a GET request for data')
  try {
    
    console.log(req.query.rating)
    const data = await Restaurant.find({"RatingValue": req.query.rating})
    res.send(data)
  } catch (error) {
    console.log(error)
  }
})




module.exports = router