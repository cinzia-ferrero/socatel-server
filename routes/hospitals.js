const express = require('express');
const router = express.Router();
const request = require('request');
const helper = require('./helper');

// @see https://opendata-ajuntament.barcelona.cat/data/en/dataset/sanitat-hospitals-atencio-primaria/resource/3cde43cd-d53a-4048-be38-4e0f8a384eea

const hospitalsData = require('./../data/hospitals');
const cleanedHospitalsData = require('./../data/hospitalsCL');

router.get('/', (req, res, next) => {
  res.status(200).json(cleanedHospitalsData);
});

router.get('/nearest', (req, res, next) => {
  const { lat, long, numElements } = req.body;
  console.log(`GET ${numElements} nearest hospitals to lat ${lat} long ${long}`);

  const nearest = helper._getNearest(cleanedHospitalsData, lat, long, numElements, 'hospital');

  res.status(200).json(nearest);
});

router.get('/clean-data', (req, res, next) => {
  const cleaned = [];
  hospitalsData.forEach(h => {
    if (cleaned.filter(thisHospital => thisHospital.code === h.CODI_EQUIPAMENT).length === 0) {
      const occurences = hospitalsData.filter(h2 => h.CODI_EQUIPAMENT === h2.CODI_EQUIPAMENT);
      const phones = occurences.map(occ => {
        return {
          type: occ.TELEFON_TIPUS,
          phone: occ.TELEFON_NUM,
          infoCom: occ.TELEFON_INFO_COM
        }
      });
      const hours = occurences.map(occ => {
        return {
          startPeriod: occ.HORARI_PERIODE_INICI,
          endPeriod: occ.HORARI_PERIODE_FI,
          startHours: occ.HORARI_HORES_INICI,
          endHours: occ.HORARI_HORES_FI,
          observacions: occ.HORARI_OBSERVACIONS,
          days: occ.HORARI_DIES
        }
      });
      const hospital = {
        name: h.EQUIPAMENT,
        code: h.CODI_EQUIPAMENT,
        latitude: h.LATITUD,
        longitude: h.LONGITUD,
        address: {
          streetType: h.TIPUS_VIA,
          street: h.NOM_CARRER,
          number1: h.NUM_CARRER_1,
          number2: h.NUM_CARRER_2,
          district: h.NOM_DISTRICTE,
          districtCode: h.CODI_DISTRICTE,
          barri: h.NUM_BARRI,
          barriCode: h.CODI_BARRI,
          postalCode: h.CODI_POSTAL,
          city: h.POBLACIO,
          cityCode: h.CODI_POBLACIO
        },
        phones,
        hours
      };

      cleaned.push(hospital);
    }
  });

  res.status(200).json(cleaned);
});

router.get('/od', (req, res, next) => {
  request
  .get('https://opendata-ajuntament.barcelona.cat/data/api/action/datastore_search?resource_id=3cde43cd-d53a-4048-be38-4e0f8a384eea')
  .on('response', response => {
    console.log('Response with status code ' + response.statusCode)
    console.log(JSON.stringify(response.body));
    res.status(200).json({
      hospitals: response.result.records
    });
  })
  .on('error', err => {
    console.log(err);
  })  
});

module.exports = router;