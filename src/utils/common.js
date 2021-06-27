'use strict';

module.exports.sleep = (ms) => {
  return new Promise((resolve) => {
    return setTimeout(resolve, ms);
  });
};
