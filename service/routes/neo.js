const Neo = require('../db/models/neo');

let neoRouter = {};

/**
 * Creates a new document with a neo
 * @param near_eart_object: (Neo)
 * @returns {Neo}
 */
neoRouter.addNeo = (async (nearEarthObject) => {
    'use strict';
    let newNeo = new Neo(nearEarthObject);
    await newNeo.validate();
    newNeo = await newNeo.save();
    return newNeo;
});

/**
 * Retrieves a list of all neos
 * @returns [Neo]
 */
neoRouter.getAllNeos = (async () => {
    'use strict';
    return await Neo.find();
});

/**
 * Get the fastest neo by ordering for speed
 * @param Boolean hazardous : filter for hazardous (true or false)
 * @returns {Neo}
 */
neoRouter.getFastestNeo = (async (hazardous) => {
    return await Neo.find({
        is_hazardous: hazardous
    }).sort({
        speed: -1
    }).limit(1);
});

/**
 * Get Neo by grouping the mouth with more neos;
 * @param Boolean hazardous : filter for hazardous (true or false)
 * @returns {mouth: number, neo_count: number}
 */
neoRouter.getBestMonth = (async (hazardous) => {
    return await Neo.aggregate(
        [{
            $match: {
                is_hazardous: hazardous
            }
        }, {
            $project: {
                month: {
                    $month: "$date"
                },
            }
        }, {
            $group: {
                _id: "$month",
                count: {
                    $sum: 1
                }
            }
        }, {
            $project: {
                month: '$_id',
                neo_count: '$count'
            }
        }]
    ).sort({
        neo_count: -1
    }).limit(1);
});

/**
 * * Get Neo by grouping the year with more neos;
 * @param Boolean hazardous : filter for hazardous (true or false)
 * @returns {year: number, neo_count: number}
 */
neoRouter.getBestYear = (async (hazardous) => {
    return await Neo.aggregate(
        [{
            $match: {
                is_hazardous: hazardous
            }
        }, {
            $project: {
                year: {
                    $year: "$date"
                },
            }
        }, {
            $group: {
                _id: "$year",
                count: {
                    $sum: 1
                }
            }
        }, {
            $project: {
                year: '$_id',
                neo_count: '$count'
            }
        }]
    ).sort({
        neo_count: -1
    }).limit(1);
});

module.exports = neoRouter;