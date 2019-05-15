const path = require('path');
const fse = require('fs-extra');
const execSync = require('child_process').execSync;
const BbPromise = require('bluebird');
const replaceTextInFile = require('../fs').replaceTextInFile;

const logger = console;

const testRegion = 'us-east-1';

const resourcePrefix = 'integ-test';

const serverlessExec = path.join(__dirname, '..', '..', '..', 'bin', 'serverless');

const serviceNameRegex = new RegExp(`${resourcePrefix}-d+`);

function getServiceName() {
  const hrtime = process.hrtime();
  return `${resourcePrefix}-${hrtime[1]}`;
}

function deployService() {
  execSync(`${serverlessExec} deploy`, { stdio: 'inherit' });
}

function removeService() {
  execSync(`${serverlessExec} remove`, { stdio: 'inherit' });
}

function replaceEnv(values) {
  const originals = {};
  for (const key of Object.keys(values)) {
    if (process.env[key]) {
      originals[key] = process.env[key];
    } else {
      originals[key] = 'undefined';
    }
    if (values[key] === 'undefined') {
      delete process.env[key];
    } else {
      process.env[key] = values[key];
    }
  }
  return originals;
}

function createTestService(templateName, tmpDir, testServiceDir) {
  const serviceName = getServiceName();

  fse.mkdirsSync(tmpDir);
  process.chdir(tmpDir);

  // create a new Serverless service
  execSync(`${serverlessExec} create --template ${templateName}`, { stdio: 'inherit' });

  if (testServiceDir) {
    fse.copySync(testServiceDir, tmpDir, { clobber: true, preserveTimestamps: true });
  }

  replaceTextInFile('serverless.yml', templateName, serviceName);

  process.env.TOPIC_1 = `${serviceName}-1`;
  process.env.TOPIC_2 = `${serviceName}-1`;
  process.env.BUCKET_1 = `${serviceName}-1`;
  process.env.BUCKET_2 = `${serviceName}-2`;
  process.env.COGNITO_USER_POOL_1 = `${serviceName}-1`;
  process.env.COGNITO_USER_POOL_2 = `${serviceName}-2`;

  // return the name of the CloudFormation stack
  return serviceName;
}

function getFunctionLogs(functionName) {
  const logs = execSync(`${serverlessExec} logs --function ${functionName} --noGreeting true`);
  const logsString = new Buffer(logs, 'base64').toString();
  process.stdout.write(logsString);
  return logsString;
}

function persistentRequest() {
  const args = [].slice.call(arguments);
  const func = args[0];
  const funcArgs = args.slice(1);
  const MAX_TRIES = 5;
  return new BbPromise((resolve, reject) => {
    const doCall = (numTry) => {
      return func.apply(this, funcArgs).then(resolve, e => {
        if (numTry < MAX_TRIES &&
          ((e.providerError && e.providerError.retryable) || e.statusCode === 429)) {
          logger.log(
            [`Recoverable error occurred (${e.message}), sleeping for 5 seconds.`,
              `Try ${numTry + 1} of ${MAX_TRIES}`].join(' ')
          );
          setTimeout(doCall, 5000, numTry + 1);
        } else {
          reject(e);
        }
      });
    };
    return doCall(0);
  });
}

module.exports = {
  logger,
  testRegion,
  resourcePrefix,
  serverlessExec,
  serviceNameRegex,
  getServiceName,
  deployService,
  removeService,
  replaceEnv,
  createTestService,
  getFunctionLogs,
  persistentRequest,
};
