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
      "REACT_NATIVE_WYRE_API_KEY": process.env.REACT_NATIVE_WYRE_API_KEY,
      "REACT_NATIVE_WYRE_SECRET_KEY": process.env.REACT_NATIVE_WYRE_SECRET_KEY,
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
