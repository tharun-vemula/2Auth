import '@babel/polyfill';

import loaders from './loaders';

const start = async () => {
  await loaders();
};

start();
