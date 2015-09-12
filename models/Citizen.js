var mongoose = require('mongoose'); 

var citizenSchema = new mongoose.Schema({
	 name: {type: String}
	,key: {type: String}
	,secret: {type: String} 
	,sex: {type: String}
	,birth: {type: Date}
});
 
module.exports = mongoose.model( 'Citizen' , citizenSchema ); 