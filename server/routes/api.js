'use strict';
const express = require('express');
const axios = require('axios');
const router = express.Router();
const models = require('../../db/models');
const db = require('../../db');
const config = require('../../config/development.json');

const KEY = config.GoogleKey;
const GeoCodeURL = 'https://maps.googleapis.com/maps/api/geocode/json?address=';

router.route('/')
  .get((req, res) => {
    res.status(200).send('Hello World!');
  })
  .post((req, res) => {
    console.log('in the correct route');
    res.status(201).send({ data: 'Posted!' });
  });

// create event in the events table
router.route('/createEvent')
  .post((req, res) => {
    let result = {};
    let string = req.body.location.split(' ').join('+');
    return new Promise((resolve, reject) => {
      resolve(axios.get(GeoCodeURL + string + '&key=' + KEY));
    })
    .then((data) => {
      const lat = data.data.results[0].geometry.location.lat;
      const lng = data.data.results[0].geometry.location.lng;
      result = {lat: lat, lng: lng};

      let eventInfo = {
        event_name: req.body.eventName,
        time: req.body.dateTime,
        location: req.body.location,
        category: req.body.category,
        description: req.body.description,
        profile_id: req.session.passport.user,
        lat: lat,
        lng: lng
      };
      return models.Event.forge(eventInfo).save();
    })
    .then(() => {
      result.status = 'saved!!!';
      res.status(201).send(result);
    })
    .catch((err) => {
      res.status(400).send('error: ' + err.toString());
    });
  });

router.route('/retrieveMarkers')
  .get((req, res) => {
    return db.knex.select('lat', 'lng').from('events')
    .then((data) => {
      res.json(data);
    })
    .catch((err) => {
      res.send('error ' + err);
    });
  });


module.exports = router;
