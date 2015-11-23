/**
 * Simply get the exported io object from the app.js and make it accessible via this module
 * (convinient to place all logic in a module
 */

var io = require('./../app.js').io;

module.exports.io = io;