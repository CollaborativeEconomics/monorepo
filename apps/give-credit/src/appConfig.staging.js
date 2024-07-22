import appConfig from './appConfig';

const siteInfo = {
  ...appConfig.siteInfo,
  title: 'Give Credit (Staging)',
  description: 'Make tax-deductible donations of carbon credits (Staging)',
};

const apis = {
  ...appConfig.apis,
  registry: {
    apiUrl: 'https://registry.staging.cfce.io/api',
  },
};

const chains = {
  ...appConfig.chains,
  defaults: {
    ...appConfig.chains.defaults,
    network: 'testnet',
  },
};

const appConfigStaging = {
  siteInfo,
  apis,
  chains,
};

export default appConfigStaging;
