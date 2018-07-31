// 1. Create an express router
const express = require('express'),
      router = express.Router();

// 2. define our coffee routes on this express router
const boycotts = [
    {
        name: "Starbucks",
        address: "250 Queen St W, Toronto, ON M5V 1Z7",
        lat: 43.6498937,
        long: -79.3912412,
        allBoycotts: [
            {
                date: 20180710,
                text: "racsim towards customers"
            },
            {
                date: 20180625,
                text: "plastic straws"
            },
            {
                date: 20180625,
                text: "the use of non-fairtrade coffee and non-organic milk"
            }
        ]
    },
    {
        name: "Starbucks",
        address: "621 King St W, Toronto, ON M5V 1M5",
        lat: 43.6473827,
        long: -79.403075,
        allBoycotts: [
            {
                date: 20180710,
                text: "racsim towards customers"
            },
            {
                date: 20180625,
                text: "plastic straws"
            }
        ]
    }
]

//GET /boycottLocation
router.get('/boycottLocation', (req, res) => {
    res.json(boycotts);
});

//POST /boycottLocation
router.post('/boycottLocation', (req, res) => {
    //take the new data in req.body, and use it to add a new boycott to our array
    let newBoycott = req.body;
    boycotts.push(newBoycott);
    res.send('success');
});

// 3. now that we have configured our routes on the router we will export it to be 
    // used in the main file
module.exports = router;