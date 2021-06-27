'use strict';

module.exports.generateAuth = (username, password) => {
  return 'Basic ' + Buffer.from(`${username}:${password}`).toString('base64');
};
