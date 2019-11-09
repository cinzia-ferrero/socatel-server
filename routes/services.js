const express = require('express');
const router = express.Router();
const helper = require('./helper');

const hospitalsData = require('./../data/hospitalsCL');
const pharmaciesData = require('./../data/pharmaciesCL');
const elderlyCareHomesData = require('./../data/elderlyCareHomesCL');

router.post('/nearest', (req, res, next) => {
  const { lat, long, query } = req.body;
  const numElements = parseInt(req.body.numElementsPerCategory);
  const parsedQuery = JSON.parse(query);
  console.log(`GET ${numElements} nearest services to lat ${lat} long ${long} with query ${JSON.stringify(parsedQuery)}`);

  let allNearest = [];

  if(parsedQuery.includes('hospital')) {
    const nearestHospitals = helper._getNearest(hospitalsData, lat, long, numElements, 'hospital');
    allNearest = allNearest.concat(nearestHospitals);
  }

  if(parsedQuery.includes('pharmacie')) {
    const nearestPharmacies = helper._getNearest(pharmaciesData, lat, long, numElements, 'pharmacie');
    allNearest = allNearest.concat(nearestPharmacies);
  }

  if(parsedQuery.includes('elderly_care_homes')) {
    const nearestElderlyCareHomes = helper._getNearest(elderlyCareHomesData, lat, long, numElements, 'elderlyCareHomes');
    allNearest = allNearest.concat(nearestElderlyCareHomes);
  }

  res.status(200).json(allNearest);
});

module.exports = router;