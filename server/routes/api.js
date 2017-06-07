'use strict';
const express = require('express');
const axios = require('axios');
const router = express.Router();
const models = require('../../db/models');
const db = require('../../db');

const KEY = process.env.GOOGLE_API_KEY;
const RevGeoCodeURL = 'https://maps.googleapis.com/maps/api/geocode/json?latlng=';
const GeoCodeURL = 'https://maps.googleapis.com/maps/api/geocode/json?address=';
const defaultImgUrl = 'https://influitive.blob.core.windows.net/media/2015/06/creating_an_online_community_b2b_expert_tips.png';

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
      if (data.data.results.length === 0) {
        let e = new Error();
        e.name = 'locationError';
        e.message = 'location cannot be found';
        throw e;
      }
      const lat = data.data.results[0].geometry.location.lat;
      const lng = data.data.results[0].geometry.location.lng;
      result = {lat: lat, lng: lng};

      let eventInfo = {
        event_name: req.body.eventName,
        time: req.body.dateTime,
        location: req.body.location,
        category: req.body.category,
        description: req.body.description,
        profile_id: req.body.userId || req.session.passport.user,
        image: req.body.imageUrl || defaultImgUrl,
        lat: lat,
        lng: lng
      };
      return models.Event.forge(eventInfo).save()
      .catch(err => { throw err; });
    })
    .then(() => {
      result.status = 'saved!!!';
      res.status(201).send(result);
    })
    .catch((err) => {
      res.status(400).send(err);
    });
  });

router.route('/reverseGeoCode')
  .post((req, res) => {
    const lat = req.body.lat;
    const lng = req.body.lng;
    axios.get(RevGeoCodeURL + lat + ',' + lng + '&key=' + KEY)
    .then((data) => {
      res.json(data.data.results[0].formatted_address);
    })
    .catch((err) => {
      res.send(err);
    });
  });

router.route('/locationInput')
  .post((req, res) => {
    axios.get(GeoCodeURL + req.body.location + '&key=' + KEY)
    .then((data) => {
      res.send(data.data.results);
    })
    .catch((err) => {
      res.send('error ' + err);
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

router.route('/retrieveEvents')
  .get((req, res) => {
    return db.knex.select().from('events')
    .then((data) => {
      res.json(data);
    })
    .catch((err) => {
      res.send('error ' + err);
    });
  });

router.route('/connectEventToProfile')
  .post((req, res) => {
    let info = {
      profile_id: req.session.passport.user,
      event_id: req.body.eventId,
    };
    return models.Event_Profile.where(info).fetch()
    .then(entry => {
      if (!entry) {
        return models.Event_Profile.forge(info).save();
      } else {
        return entry;
      }
    })
    .then((data) => {
      res.send(data);
    })
    .catch(err => { res.send(err); });
  });

router.route('/attendEvent')
  .post((req, res) => {
    return db.knex('events_profiles')
    .where({
      profile_id: req.session.passport.user,
      event_id: req.body.eventId
    })
    .update({ is_attending: true })
    .then(() => { res.send('attended event'); })
    .catch(err => { res.send(err); });
  });

router.route('/likeEvent')
  .post((req, res) => {
    return db.knex('events_profiles')
    .where({
      profile_id: req.session.passport.user,
      event_id: req.body.eventId
    })
    .update({ liked: true })
    .then(() => { res.send('liked event'); })
    .catch(err => { res.send(err); });
  });

router.route('/retrieveParticipants')
  .post((req, res) => {
    return db.knex('events_profiles')
    .where('event_id', '=', req.body.eventId)
    .select('profile_id')
    .then((data) => {
      let ids = data.map(obj => obj.profile_id);
      return db.knex.select('display', 'email').from('profiles')
      .whereIn('id', ids);
    })
    .then((data) => {
      res.send(data);
    })
    .catch(err => { res.send(err); });
  });

module.exports = router;
