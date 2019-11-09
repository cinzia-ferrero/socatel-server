const express = require('express');
const router = express.Router();
const request = require('request');
const helper = require('./helper');

const path = require('path');
const fs = require('fs');
const xml2js = require('xml2js');

const agendaData = require('./../data/agenda.json');
const cleanedAgendaData = require('./../data/agendaCL');

/*
router.get('/', (req, res, next) => {
  const filePath = path.join(__dirname, '..', 'data', 'agenda.xml');
  try {
    var fileData = fs.readFileSync(filePath, 'ascii');
    var parser = new xml2js.Parser();
    parser.parseString(fileData.substring(0, fileData.length), function (err, result) {
      res.status(200).json(result);
    });
    console.log("File '" + filePath + "/ was successfully read.\n");
  } catch (err) {
    console.log(err);
  }
});
*/

router.post('/nearest', (req, res, next) => {
  const { lat, long } = req.body;
  const numElements = parseInt(req.body.numElements);
  console.log(`GET ${numElements} nearest hospitals to lat ${lat} long ${long}`);

  const nearest = helper._getAgendaNearest(cleanedAgendaData, lat, long, numElements, 'agenda');

  res.status(200).json(nearest);
});

router.get('/clean-data', (req, res, next) => {
  console.log(agendaData.length);
  //const sliced = agendaData.slice(0,50);
  const cleaned = agendaData.map(i => {
    let item = i.item[0];
    delete item.likeit;
    delete item.$;
    delete item.addresses;
    delete item.equipment_id;
    delete item.sigla;
    delete item.votes;
    delete item.tp;
    delete item.pos;

    if (item.gmapx && item.gmapx[0]) {
      item.latitude = item.gmapx[0]._;
      delete item.gmapx;
    }    
    if (item.gmapy && item.gmapy[0]) {
      item.longitude = item.gmapy[0]._;
      delete item.gmapy;
    }
    if (item.begindate && item.begindate[0]) {
      item.begindate = item.begindate[0]._;
    }
    if (item.enddate && item.enddate[0]) {
      item.enddate = item.enddate[0]._;
    }
    if (item.address && item.address[0]) {
      item.address = item.address[0]._;
    }
    if (item.city && item.city[0]) {
      item.city = item.city[0]._;
    }
    if (item.district && item.district[0]) {
      item.district = item.district[0]._;
    }
    if (item.institutionname && item.institutionname[0]) {
      item.institutionname = item.institutionname[0]._;
    }
    if (item.name && item.name[0]) {
      item.name = item.name[0]._;
    }
    if (item.id && item.id[0]) {
      item.id = item.id[0]._;
    }
    if (item.phonenumber && item.phonenumber[0]) {
      item.phonenumber = item.phonenumber[0]._;
    }
    if (item.proxdate && item.proxdate[0]) {
      item.proxdate = item.proxdate[0]._;
    }
    if (item.type && item.type[0]) {
      item.type = item.type[0]._;
    }
    if (item.proxhour && item.proxhour[0]) {
      item.proxhour = item.proxhour[0]._;
    }
    if (item.internetref && item.internetref[0]) {
      item.internetref = item.internetref[0]._;
    }
    if (item.warning && item.warning[0]) {
      item.warning = item.warning[0]._;
    }
    if (item.interestinfo && item.interestinfo[0]) {
      item.interestinfo = item.interestinfo[0].item[0].interinfo[0];
    }
    if (item.date && item.date[0]) {
      item.date = item.date[0]._;
    }
    if (item.status && item.status[0]) {
      item.status = {
        code: item.status[0].item[0].code[0],
        name: item.status[0].item[0].name[0]
      }
    }   
    
    return item;
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