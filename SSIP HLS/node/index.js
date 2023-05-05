const express = require('express');
const app = express();
const googleMapsClient = require('@google/maps').createClient({
    key: 'AIzaSyBXk2AeeCY5vuSbX-aSS4slNyqE6h7Ipuk'
});

app.get('/location/:address', (req, res) => {
    const address = req.params.address;

    googleMapsClient.geocode({
        address: address
    }, function (err, response) {
        if (!err) {
            const location = response.json.results[0].geometry.location;
            res.json(location);
        } else {
            console.log(err);
            res.status(500).send('Error retrieving location data');
        }
    });
});

app.get('/places/:lat/:lng/:type', (req, res) => {
    const lat = req.params.lat;
    const lng = req.params.lng;
    const type = req.params.type;

    googleMapsClient.placesNearby({
        location: `${lat},${lng}`,
        radius: 5000,
        type: type
    }, function (err, response) {
        if (!err) {
            const places = response.json.results;
            res.json(places);
        } else {
            console.log(err);
            res.status(500).send('Error retrieving nearby places data');
        }
    });
});

app.listen(3000, () => {
    console.log('Server listening on port 3000');
});
