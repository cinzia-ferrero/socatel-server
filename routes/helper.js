const geolib = require('geolib');

class Helper {
  static _getNearest(data, lat, long, numElements, category) {
    let nearest = geolib.orderByDistance({ latitude: lat, longitude: long }, data);
    nearest = nearest.slice(0, numElements);
  
    nearest = nearest.map(obj => {
      const distance = geolib.getDistance(
        { latitude: lat, longitude: long }, 
        { latitude: obj.latitude, longitude: obj.longitude}
      );
      const addressString = `${obj.address.streetType} ${obj.address.street} ${obj.address.number1}, ${obj.address.postalCode} ${Helper._capitalize(obj.address.city)}`;
      delete obj.address;
      return Object.assign(obj, { addressString, distance, category });
    });
  
    return nearest;
  }

  static _getAgendaNearest(data, lat, long, numElements, category) {
    let nearest = geolib.orderByDistance({ latitude: lat, longitude: long }, data);
    nearest = nearest.slice(0, numElements);
  
    nearest = nearest.map(obj => {
      const distance = geolib.getDistance(
        { latitude: lat, longitude: long }, 
        { latitude: obj.latitude, longitude: obj.longitude}
      );
      return Object.assign(obj, { distance, category });
    });
  
    return nearest;
  }

  static _capitalize(string) {
    const formattedString = string.toLowerCase();
    return formattedString.charAt(0).toUpperCase() + formattedString.slice(1);
  }
}

module.exports = Helper;
