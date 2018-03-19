const axios = require('axios');
const Promise = require('bluebird');
const moment = require('moment');

const neoApiUrl = 'https://api.nasa.gov/neo/rest/v1/feed';
const serverUrl = 'http://127.0.0.1:8080/neo/hazardous';

/**
 * Retrieves all neos since start_date and end_date.
 * One request is sent per week
 * @param start_date
 * @param end_date
 * @returns {Promise.<*>}
 */
const getNeos = (async (start_date, end_date) => {
    try {
        const { data } = await axios.get(neoApiUrl, {
            params: {
                start_date,
                end_date,
                api_key: process.env.NASA_API_KEY || 'N7LkblDsc5aen05FJqBQ8wU4qSdmsftwJagVK7UD'
            }
        });
        // for each date, serialize all the neos
        return Object.keys(data.near_earth_objects).reduce((array, neoDate) => {
            return array.concat(data.near_earth_objects[neoDate].map(neoPerDate => {
                return _serializeNeo(neoPerDate, neoDate);
            }));
        }, []);

    } catch (err) {
        console.error(err.stack);
    }
});

/**
 *  Create a neo Object at or dev server
 * @param neo 
 */
const uploadNeo = (async (neo) => {
    try {
        return await axios.post(serverUrl, neo);
    } catch (err) {
        console.error(err.stack);
    }
});


/**
 * Serialize an entry from the nasa's api into an object comforming to the Neo schema
 * @param neo_reference_id
 * @param name
 * @param close_approach_data
 * @param is_potentially_hazardous_asteroid
 * @param date
 * @returns {{date: *, reference: *, name: *, speed: number, is_hazardous: *}}
 * @private
 */
const _serializeNeo = ({ neo_reference_id, name, close_approach_data, is_potentially_hazardous_asteroid }, date = null) => {
    return {
        date: date,
        reference: neo_reference_id,
        name: name,
        speed: close_approach_data[0].relative_velocity.kilometers_per_hour,
        is_hazardous: is_potentially_hazardous_asteroid
    }
}

// Initiate the feed
const run_import = (async () => {
    const start_date = moment().subtract(3, 'days').format('YYYY-MM-DD');
    const end_date = moment().format('YYYY-MM-DD');
    const neos = await getNeos(start_date, end_date);
    return Promise.all(neos.map(uploadNeo));
});

Promise.all(run_import()).catch(err => console.error(err));

