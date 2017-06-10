'use strict';
const express = require('express');
const axios = require('axios');
const router = express.Router();
const models = require('../../db/models');
const db = require('../../db');

const AWS_ACCESS_KEY_ID = process.env.AWS_ACCESS_KEY_ID;
const AWS_SECRET_ACCESS_KEY = process.env.AWS_SECRET_ACCESS_KEY;
const S3_BUCKET = process.env.S3_BUCKET;
const BUCKET_REGION = process.env.BUCKET_REGION;

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
      console.log('Error:', err);
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
    if (req.body.location === '') {
      res.send([]);
    } else {
      axios.get(GeoCodeURL + req.body.location + '&key=' + KEY)
      .then((data) => {
        res.send(data.data.results);
      })
      .catch((err) => {
        res.send('error ' + err);
      });
    }
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

router.route('/retrieveCategoryEvents')
  .get((req, res) => {
    const category = req.query.query;
    if (category === 'All') {
      return db.knex.select().from('events')
      .then((data) => {
        res.json(data);
      })
      .catch((err) => {
        res.send('error ' + err);
      });
    } else {
      return db.knex.select().from('events')
      .where({ category: category })
      .then((data) => {
        res.json(data);
      })
      .catch((err) => {
        res.send('error ' + err);
      });
    }
  });

router.route('/connectEventToProfile')
  .post((req, res) => {
    let info = {
      profile_id: req.body.userId || req.session.passport.user,
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
      profile_id: req.body.userId || req.session.passport.user,
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
      profile_id: req.body.userId || req.session.passport.user,
      event_id: req.body.eventId
    })
    .update({ liked: true })
    .then(() => {
      res.send('liked event');
    })
    .catch(err => { res.send(err); });
  });

router.route('/countLikes')
  .post((req, res) => {
    let options = {
      event_id: req.body.eventId,
      liked: true
    };
    return models.Event_Profile.where(options).count()
    .then((data) => {
      res.send(data);
    })
    .catch(err => { res.send(err); });
  });


// router.route('/retrieveParticipants')
//   .post((req, res) => {
//     models.Event_Profile.where({profile_id: req.body.eventId}).fetchAll({withRelated: ['profile']})
//     .then((profiles) => {
//       res.send(profiles);
//     })
//     .catch((err) => {
//       console.log(err);
//       res.send(err);
//     });
//   });

router.route('/retrieveParticipants')
  .post((req, res) => {
    let options = {
      event_id: req.body.eventId,
      is_attending: true
    };
    return db.knex('events_profiles')
    .where(options)
    .select('profile_id')
    .then((data) => {
      let ids = data.map(obj => obj.profile_id);
      return db.knex.select('display', 'email', 'profile_picture').from('profiles')
      .whereIn('id', ids);
    })
    .then((data) => {
      res.send(data);
    })
    .catch(err => { res.send(err); });
  });

router.route('/retrieveUserEvents')
  .get((req, res) => {
    let options = {
      profile_id: req.body.profileId || req.session.passport.user,
      is_attending: true
    };
    models.Event_Profile.where(options).fetchAll({withRelated: ['event']})
    .then((profiles) => {
      res.send(profiles);
    })
    .catch((err) => {
      console.log(err);
      res.send(err);
    });
  });

router.route('/retrieveS3Credentials')
  .get((req, res) => {
    res.send({
      accessKey: AWS_ACCESS_KEY_ID,
      secretKey: AWS_SECRET_ACCESS_KEY,
      bucket: S3_BUCKET,
      region: BUCKET_REGION,
      successStatus: 201
    });
  });

router.route('/comments')
.post((req, res) => {
  const commentInfo = {
    event_id: req.body.event_id,
    profile_id: req.session.passport.user,
    text: req.body.text,
    username: ''
  };
  models.Profile.where({id: req.session.passport.user}).fetch()
  .then(data => {
    commentInfo.username = data.attributes.display;
    return models.Comment.forge(commentInfo).save()
    .then(data => {
      res.send(data);
    })
    .catch(error => {
      console.log('There was an error saving comments to the databse! ', error);
    });
  });
});

router.route('/comments')
.get()


module.exports = router;
