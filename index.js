const dayjs = require('dayjs');

module.exports.handler = async (event) => {
    return {
            body: JSON.stringify({ message: 'Jenkins tests' }),
            statusCode: 200
        };
};
