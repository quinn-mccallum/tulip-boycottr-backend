// 1. Create an express router
const express = require('express'),
      router = express.Router();
const admin = require("firebase-admin");

const db = admin.firestore();
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
router.get('/boycottLocation', async (req, res) => {
    db.collection('boycottLocations').get()
    .then(snapshot=> {
      const boycottData = [];
      snapshot.forEach(doc => {
        boycottData.push({id: doc.id, data: doc.data()});
      })
      res.json(boycottData);
    })
    .catch(err=>{
      console.log(err);
      res.status(404).send();
    })
});

//POST /boycottLocation
router.post('/boycottLocation', (req, res) => {
    const { name, address, lat, lng, date, text } = req.body;
    let data = {
      name: name,
      address: address,
      lat: Number(lat),
      lng: Number(lng),
      allBoycotts: [
        {
          date: Number(date),
          text: text,
        }
      ]
    }

    db.collection('boycottLocations').add(data)
      .then(doc => {
        res.send('Successfully saved boycott.');
      })
      .catch(error => {
        res.send(error);
        console.log(error);
      })


    //take the new data in req.body, and use it to add a new boycott to our array
    // let newBoycott = req.body;
    // boycotts.push(newBoycott);
    // res.send('success');
});

// 3. now that we have configured our routes on the router we will export it to be
    // used in the main file
module.exports = router;
