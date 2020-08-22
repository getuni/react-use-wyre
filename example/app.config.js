require("dotenv/config");

module.exports = {
  "expo": {
    "name": "example",
    "scheme": "myapp",
    "slug": "example",
    "version": "1.0.0",
    "orientation": "portrait",
    "icon": "./assets/icon.png",
    "extra": {
      "WYRE_API_KEY": process.env.WYRE_API_KEY,
      "WYRE_SECRET_KEY": process.env.WYRE_SECRET_KEY,
      "WYRE_PARTNER_ID": process.env.WYRE_PARTNER_ID,
    },
    "splash": {
      "image": "./assets/splash.png",
      "resizeMode": "contain",
      "backgroundColor": "#ffffff"
    },
    "updates": {
      "fallbackToCacheTimeout": 0
    },
    "assetBundlePatterns": [
      "**/*"
    ],
    "ios": {
      "supportsTablet": true
    },
    "web": {
      "favicon": "./assets/favicon.png"
    }
  }
}
