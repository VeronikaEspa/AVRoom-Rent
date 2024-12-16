import {
  getEnvVariable,
  validateEnvironmentVariables,
} from '../utils/env.utils';

const requiredVars = ['NEXT_PUBLIC_BACKEND_URL'];

validateEnvironmentVariables(requiredVars);

export const config = {
  backUrl: getEnvVariable('NEXT_PUBLIC_BACKEND_URL')
};
