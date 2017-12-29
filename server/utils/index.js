//Converts degrees to radians
if (typeof Number.prototype.toRad === 'undefined') {
  Number.prototype.toRad = function() {
    return this * Math.PI / 180
  }
}

/** 
 * curry for a function that will return distance bewteen two points
@param start
@param decimals
@return {Function}
**/
const distanceBetweenTwoPoints = (start, decimals = 2) => {
  const earthRadius = 6371 // km
  const lon1 = parseFloat(start.longitude)
  let lat1 = parseFloat(start.latitude)

  return end => {
    const lon2 = parseFloat(end.longitude)
    let lat2 = parseFloat(end.latitude)

    const dLat = (lat2 - lat1).toRad()
    const dLon = (lon2 - lon1).toRad()
    lat1 = lat1.toRad()
    lat2 = lat2.toRad()

    const a =
      Math.sin(dLat / 2) * Math.sin(dLat / 2) +
      Math.sin(dLon / 2) * Math.sin(dLon / 2) * Math.cos(lat1) * Math.cos(lat2)
    const c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1 - a))
    const d = earthRadius * c
    return Math.round(d * Math.pow(10, decimals)) / Math.pow(10, decimals)
  }
}

module.exports = {
  distanceBetweenTwoPoints
}
