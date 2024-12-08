import {
  getEnvVariable,
  validateEnvironmentVariables,
} from '../utils/env.utils';

const requiredVars = ['BACKEND_URL'];

validateEnvironmentVariables(requiredVars);

export const config = {
  backUrl: getEnvVariable('BACKEND_URL')
};
