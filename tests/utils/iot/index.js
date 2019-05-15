const AWS = require('aws-sdk');
const region = require('../misc').testRegion;

function publishIotData(topic, message) {
  const Iot = new AWS.Iot({ region });

  return Iot.describeEndpoint().promise()
    .then(data => {
      const IotData = new AWS.IotData({ region, endpoint: data.endpointAddress });

      const params = {
        topic,
        payload: new Buffer(message),
      };

      return IotData.publish(params).promise();
    });
}

module.exports = {
  publishIotData,
};
