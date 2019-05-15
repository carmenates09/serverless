const AWS = require('aws-sdk');
const _ = require('lodash');
const region = require('../misc').testRegion;

function findStacks(name, status) {
  const CF = new AWS.CloudFormation({ region });

  const params = {};
  if (status) {
    params.StackStatusFilter = status;
  }

  function recursiveFind(found, token) {
    if (token) params.NextToken = token;
    return CF.listStacks(params).promise().then(result => {
      const matches = result.StackSummaries.filter(stack => stack.StackName.match(name));
      if (matches.length) {
        _.merge(found, matches);
      }
      if (result.NextToken) return recursiveFind(found, result.NextToken);
      return found;
    });
  }

  return recursiveFind([]);
}

function listStacks(status) {
  const CF = new AWS.CloudFormation({ region });

  const params = {};
  if (status) {
    params.StackStatusFilter = status;
  }

  return CF.listStacks(params).promise();
}

module.exports = {
  findStacks,
  listStacks,
};
