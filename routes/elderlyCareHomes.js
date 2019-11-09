const express = require('express');
const router = express.Router();
const helper = require('./helper');

// @see https://opendata-ajuntament.barcelona.cat/data/en/dataset/serveissocials-residenciesgentgran/resource/1fdd6f57-0f41-4b27-b8f0-57e6d04f229a

const ECHomesData = require('./../data/elderlyCareHomes');
const cleanedECHomesData = require('./../data/elderlyCareHomesCL');

router.get('/', (req, res, next) => {
  res.status(200).json(cleanedECHomesData);
});

router.get('/nearest', (req, res, next) => {
  const { lat, long, numElements } = req.body;
  console.log(`GET ${numElements} nearest elderly care homes to lat ${lat} long ${long}`);

  const nearest = helper._getNearest(cleanedECHomesData, lat, long, numElements, 'elderlyCareHomes');

  res.status(200).json(nearest);
});

router.get('/clean-data', (req, res, next) => {
  const cleaned = [];
  ECHomesData.forEach(ech => {
    if (cleaned.filter(thisECHome => thisECHome.code === ech.CODI_EQUIPAMENT).length === 0) {
      const occurences = ECHomesData.filter(ech2 => ech.CODI_EQUIPAMENT === ech2.CODI_EQUIPAMENT);
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
      const ECHome = {
        name: ech.EQUIPAMENT,
        code: ech.CODI_EQUIPAMENT,
        latitude: ech.LATITUD,
        longitude: ech.LONGITUD,
        address: {
          streetType: ech.TIPUS_VIA,
          street: ech.NOM_CARRER,
          number1: ech.NUM_CARRER_1,
          number2: ech.NUM_CARRER_2,
          district: ech.NOM_DISTRICTE,
          districtCode: ech.CODI_DISTRICTE,
          barri: ech.NUM_BARRI,
          barriCode: ech.CODI_BARRI,
          postalCode: ech.CODI_POSTAL,
          city: ech.POBLACIO,
          cityCode: ech.CODI_POBLACIO
        },
        phones,
        hours
      };

      cleaned.push(ECHome);
    }
  });

  res.status(200).json(cleaned);
});

module.exports = router;