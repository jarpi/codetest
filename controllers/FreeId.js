//****************
// Dependencies***
//**************** 

var uuidGenerator = require('uuid-lib'); 
var mongoose = require('mongoose'); 
var freeIdModel = require('../models/FreeId.js'); 
var freeId = mongoose.model('FreeId');

//************************** 
// Business Logic **********
//************************** 

var freeIdsFindAll = function( cb ) {
	freeId.find({}, function ( err , freeIds ) {
		if (err) return cb(err, null); 
		cb(null, freeIds);   
	}); 	
}; 


var freeIdAdd = function ( key , cb ) {
	var freeIdDataModel = new freeIdModel({ 'key' : key }); 
	freeIdDataModel.save(function(err, newKey) {
		if (err) return cb(err, null); 
		cb(null, newKey); 
	}); 
}; 

var freeIdAddOne = function ( cb ) {
	var freeIdDataModel = new freeIdModel({ 'key' : uuidGenerator.raw() }); 
	freeIdDataModel.save(function(err, newKey) { 
		if (err) return cb(err, null); 
		cb(null, newKey); 
	}); 
}; 

var freeIdDelete = function(key, cb ) {
	freeId.remove({ 'key' : key }, function(err , totalRemovedKey) {
		if (err) return cb(err, null); 
		cb(null, totalRemovedKey); 
	}); 
}; 

var freeIdDeleteAll = function( cb ) {
	freeId.remove({}, function(err, removedKeys) {
		if (err) return cb(err, null); 
		cb(null, removedKeys); 
	}); 
}; 

var freeIdGetOne = function(cb) {
	freeId.findOne({}, function(err , returnedFreeId) {
		if (err || returnedFreeId == null || returnedFreeId === '' || returnedFreeId === []) return cb(err || new Error("No id available"), null); 
		cb(null, returnedFreeId); 
	}); 
}; 

module.exports = { getIds : freeIdsFindAll , enQueue : freeIdAdd ,  generateNewId : freeIdAddOne , delFreeIdByKey : freeIdDelete , delAllFreeIdKeys : freeIdDeleteAll , deQueue : freeIdGetOne }; 
 
