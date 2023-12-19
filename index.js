const express = require('express');
const cors = require('cors');
const dotenv = require('dotenv').config()
const axios = require('axios');
const { decode } = require('./flexPoly');
const { encode } = require('@googlemaps/polyline-codec');






const app = express();

//cors config
app.use(cors({ origin: true, credentials: true }))
//express json
app.use(express.json())
//url encode
app.use(express.urlencoded({ extended: false }));



//  server logic goes here...

app.post('/getroutes', async (req, res) => {

  const { polyline, vehicle } = req.body
  const result=decode(polyline)
  const en_code=encode(result.polyline,5)
  const options = {
    'mapProvider': 'here',
    'polyline': en_code,
    'vehicle': vehicle,
    "units": {
      "currency": "INR"
    }
  }



  try {
    const response = await axios.post('https://apis.tollguru.com/toll/v2/complete-polyline-from-mapping-service', options, {
      "headers": {
        "x-api-key": process.env.TOLL_API_KEY
      }
    })
     res.send({data:response.data.route,polyline:en_code})
  } catch (error) {
    console.log(error)
  }

})


// Start the server
app.listen(process.env.PORT, () => {
  console.log(`Server running on port ${process.env.PORT}`);
});
