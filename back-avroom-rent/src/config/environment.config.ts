import {
  getEnvVariable,
  validateEnvironmentVariables,
} from '../utils/env.utils';

const requiredVars = ['JWT_SECRET', 'NODE_ENV', 'MONGO_URI'];

validateEnvironmentVariables(requiredVars);

export const config = {
  jwtSecret: getEnvVariable('JWT_SECRET'),
  env: getEnvVariable('NODE_ENV'),
  mongo: getEnvVariable('MONGO_URI'),
};
