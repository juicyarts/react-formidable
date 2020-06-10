const getNoVerifyInfo = require('./bypass');

const { verify } = getNoVerifyInfo(process.argv[2]);
process.exit(verify ? 1 : 0);
