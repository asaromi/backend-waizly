const fetch = require('node-fetch')

exports.getLocation = async (ip_address) => {
  const response = await fetch(`https://ipapi.co/${ip_address}/json`, {
    headers: { 'User-Agent': 'nodejs-ipapi-v1.02' }
  })

  const {
    latitude,
    longitude,
    city,
    region,
    country_name: countryName,
    country_code: countryCode,
    utc_offset: utcOffset
  } = await response.json()
  return { latitude, longitude, city, region, countryName, countryCode, utcOffset }
}
