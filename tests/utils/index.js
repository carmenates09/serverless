'use strict';

const awsCleanup = require('./aws-cleanup');
const logger = require('./misc').logger;
const testRegion = require('./misc').testRegion;
const resourcePrefix = require('./misc').resourcePrefix;
const serverlessExec = require('./misc').serverlessExec;
const deployService = require('./misc').deployService;
const removeService = require('./misc').removeService;
const serviceNameRegex = require('./misc').serviceNameRegex;
const getServiceName = require('./misc').getServiceName;
const createTestService = require('./misc').createTestService;
const replaceEnv = require('./misc').replaceEnv;
const getFunctionLogs = require('./misc').getFunctionLogs;
const persistentRequest = require('./misc').persistentRequest;
const ServerlessPlugin = require('./plugins').ServerlessPlugin;
const installPlugin = require('./plugins').installPlugin;
const getTmpDirPath = require('./fs').getTmpDirPath;
const getTmpFilePath = require('./fs').getTmpFilePath;
const replaceTextInFile = require('./fs').replaceTextInFile;
const readYamlFile = require('./fs').readYamlFile;
const writeYamlFile = require('./fs').writeYamlFile;
const putCloudWatchEvents = require('./cloudwatch').putCloudWatchEvents;
const findStacks = require('./cloudformation').findStacks;
const listStacks = require('./cloudformation').listStacks;
const getCognitoUserPoolId = require('./cognito').getCognitoUserPoolId;
const createCognitoUser = require('./cognito').createCognitoUser;
const publishIotData = require('./iot').publishIotData;
const createAndRemoveInBucket = require('./s3').createAndRemoveInBucket;
const deleteBucket = require('./s3').deleteBucket;
const emptyBucket = require('./s3').emptyBucket;
const createSnsTopic = require('./sns').createSnsTopic;
const removeSnsTopic = require('./sns').removeSnsTopic;
const publishSnsMessage = require('./sns').publishSnsMessage;
const createRestApi = require('./api-gateway').createRestApi;
const deleteRestApi = require('./api-gateway').deleteRestApi;
const getResources = require('./api-gateway').getResources;
const findRestApis = require('./api-gateway').findRestApis;

module.exports = {
  // cleanup
  awsCleanup,
  // misc
  logger,
  testRegion,
  resourcePrefix,
  serverlessExec,
  deployService,
  removeService,
  serviceNameRegex,
  getServiceName,
  createTestService,
  replaceEnv,
  getFunctionLogs,
  persistentRequest,
  // filesystem
  getTmpDirPath,
  getTmpFilePath,
  replaceTextInFile,
  readYamlFile,
  writeYamlFile,
  // plugins
  ServerlessPlugin,
  installPlugin,
  // services
  createAndRemoveInBucket: persistentRequest.bind(this, createAndRemoveInBucket),
  deleteBucket: persistentRequest.bind(this, deleteBucket),
  emptyBucket: persistentRequest.bind(this, emptyBucket),
  createSnsTopic: persistentRequest.bind(this, createSnsTopic),
  removeSnsTopic: persistentRequest.bind(this, removeSnsTopic),
  publishSnsMessage: persistentRequest.bind(this, publishSnsMessage),
  publishIotData: persistentRequest.bind(this, publishIotData),
  putCloudWatchEvents: persistentRequest.bind(this, putCloudWatchEvents),
  findStacks: persistentRequest.bind(this, findStacks),
  listStacks: persistentRequest.bind(this, listStacks),
  getCognitoUserPoolId: persistentRequest.bind(this, getCognitoUserPoolId),
  createCognitoUser: persistentRequest.bind(this, createCognitoUser),
  createRestApi: persistentRequest.bind(this, createRestApi),
  deleteRestApi: persistentRequest.bind(this, deleteRestApi),
  getResources: persistentRequest.bind(this, getResources),
  findRestApis: persistentRequest.bind(this, findRestApis),
};
