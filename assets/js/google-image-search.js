const GoogleImages = require('google-images');
const Config = require('electron-config');
const config = new Config();

module.exports = class GoogleImageScraper {
    static async searchImage(query) {
        let client = new GoogleImages(config.get('cse'), config.get('api_key'));
        return client.search(query)
    }
};