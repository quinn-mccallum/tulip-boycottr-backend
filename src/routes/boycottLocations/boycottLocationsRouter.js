// 1. Create an express router
const express = require('express'),
      router = express.Router();
const request = require('request');
const admin = require("firebase-admin");
const googleClient = require('@google/maps').createClient({
  key: 'AIzaSyAO3LC4QRW4h7ZNruufzuVFfdx5v-PWRus'
});

const db = admin.firestore();

// 2. define our coffee routes on this express router

router.get('/places', (req, res)=> {
  request(`https://maps.googleapis.com/maps/api/place/autocomplete/json?input=${req.query.place}&radius=1000&location=${req.query.lat},${req.query.lng}&types=establishment&strictbounds&key=AIzaSyAO3LC4QRW4h7ZNruufzuVFfdx5v-PWRus`, (err, resp, body)=> {
    if(err){
      console.log(err);
      res.json(err);
    }
    else {
      console.log(body);
      const parsedBod = JSON.parse(body);
      res.json(parsedBod);
    }
  })
    // .then(data=> {
    //   res.json(data);
    //   console.log('the data we got from the FETCH is: ', data);
    // })
    // .catch(err=> {
    //   res.status(401).send(err);
    //   console.log('we got an error from the FETCH with: ', err);
    // })
})

router.get('/nearby/:lat&:lng', (req, res) => {
  googleClient.placesNearby({location: {lat: req.params.lat, lng: req.params.lng}, radius: 1000}, (err, data)=> {
    if(err){
      console.log(err);
      res.json(err);
    }
    else{
      res.json(data);
    }
  })
})

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
    let text = ''
    for(key in req.body.reasons){
      if(key === 'other'){
        text += `${req.body.reasons[key]}, `
      }
      else {
        text += `${key}, `
      }
    }
    text = text.slice(0,-2);
    const { name, address, lat, lng } = req.body;
    const date = new Date();
    let data = {
      name: name,
      address: address,
      lat: Number(lat),
      lng: Number(lng),
      allBoycotts: [
        {
          date: date,
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
});

router.get('/establishmentInfo/:id', (req, res)=> {
  request(`https://maps.googleapis.com/maps/api/place/details/json?key=AIzaSyAO3LC4QRW4h7ZNruufzuVFfdx5v-PWRus&placeid=${req.params.id}`, (err, response, body)=>{
    if(err){
      res.status(400).send(err)
    }
    else {
      const parsedBod = JSON.parse(body);
      const { lat, lng } = parsedBod.result.geometry.location;
      const { formatted_address: address, name } = parsedBod.result;
      res.send({ lat, lng, address, name });
    }
  })
})

// router.put('/boycottLocation', (req, res) => {
//   let data = {
//     allBoycotts: [
//       {
//         date: Number(date),
//         text: text
//       }
//     ]
//   }
//
//   db.collection('boycottLocations').doc(*id*).update({
//
//   })
// });



// 3. now that we have configured our routes on the router we will export it to be
    // used in the main file
module.exports = router;
