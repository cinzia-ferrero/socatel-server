const express = require('express');
const router = express.Router();
const helper = require('./helper');

// @see https://opendata-ajuntament.barcelona.cat/data/en/dataset/sanitat-farmacies/resource/7d02a5a0-5339-4289-bc6b-7260484ff435

const pharmaciesData = require('./../data/pharmacies');
const cleanedPharmaciesData = require('./../data/pharmaciesCL');

router.get('/', (req, res, next) => {
  res.status(200).json(cleanedPharmaciesData);
});

router.get('/nearest', (req, res, next) => {
  const { lat, long, numElements } = req.body;
  console.log(`GET ${numElements} nearest pharmacies to lat ${lat} long ${long}`);

  const nearest = helper._getNearest(cleanedPharmaciesData, lat, long, numElements, 'pharmacie');

  res.status(200).json(nearest);
});

router.get('/clean-data', (req, res, next) => {
  const cleaned = [];
  pharmaciesData.forEach(p => {
    if (cleaned.filter(thisPharmacie => thisPharmacie.code === p.CODI_EQUIPAMENT).length === 0) {
      const occurences = pharmaciesData.filter(p2 => p.CODI_EQUIPAMENT === p2.CODI_EQUIPAMENT);
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
      const pharmacie = {
        name: p.EQUIPAMENT,
        code: p.CODI_EQUIPAMENT,
        latitude: p.LATITUD,
        longitude: p.LONGITUD,
        address: {
          streetType: p.TIPUS_VIA,
          street: p.NOM_CARRER,
          number1: p.NUM_CARRER_1,
          number2: p.NUM_CARRER_2,
          district: p.NOM_DISTRICTE,
          districtCode: p.CODI_DISTRICTE,
          barri: p.NUM_BARRI,
          barriCode: p.CODI_BARRI,
          postalCode: p.CODI_POSTAL,
          city: p.POBLACIO,
          cityCode: p.CODI_POBLACIO
        },
        phones,
        hours
      };

      cleaned.push(pharmacie);
    }
  });

  res.status(200).json(cleaned);
});

module.exports = router;