const AWS = require('aws-sdk');
const region = require('../misc').testRegion;

function putCloudWatchEvents(sources) {
  const cwe = new AWS.CloudWatchEvents({ region });

  const entries = [];
  sources.forEach(source => {
    entries.push({
      Source: source,
      DetailType: 'serverlessDetailType',
      Detail: '{ "key1": "value1" }',
    });
  });
  const params = {
    Entries: entries,
  };
  return cwe.putEvents(params).promise();
}

module.exports = {
  putCloudWatchEvents,
};
