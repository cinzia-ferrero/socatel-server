const express = require('express');
const router = express.Router();
const helper = require('./helper');

const hospitalsData = require('./../data/hospitalsCL');
const pharmaciesData = require('./../data/pharmaciesCL');
const elderlyCareHomesData = require('./../data/elderlyCareHomesCL');

router.get('/nearest', (req, res, next) => {
  const { lat, long, query } = req.body;
  const numElements = req.body.numElementsPerCategory;
  console.log(`GET ${numElements} nearest services to lat ${lat} long ${long} with query ${JSON.stringify(query)}`);

  let allNearest = [];

  if(query.includes('hospital')) {
    const nearestHospitals = helper._getNearest(hospitalsData, lat, long, numElements, 'hospital');
    allNearest = allNearest.concat(nearestHospitals);
  }

  if(query.includes('pharmacie')) {
    const nearestPharmacies = helper._getNearest(pharmaciesData, lat, long, numElements, 'pharmacie');
    allNearest = allNearest.concat(nearestPharmacies);
  }

  if(query.includes('elderly_care_homes')) {
    const nearestElderlyCareHomes = helper._getNearest(elderlyCareHomesData, lat, long, numElements, 'elderlyCareHomes');
    allNearest = allNearest.concat(nearestElderlyCareHomes);
  }

  res.status(200).json(allNearest);
});

module.exports = router;