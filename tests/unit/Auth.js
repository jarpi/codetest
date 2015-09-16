//******************
// Dependencies **** 
//****************** 
var should = require('should'); 
var mongoose = require('mongoose');
var citizenCtrl = require('../../controllers/Citizen.js'); 
var citizenModel = mongoose.model('Citizen'); 
var freeIdCtrl = require('../../controllers/FreeId.js');  
var authCtrl = require('../../controllers/Auth.js'); 
var config = require('../../config/config.js'); 
 
//******************* 
// Test cases ******* 
//******************* 
describe('FreeId', function() {
	before(function(done) {
		mongoose.connect(config.db_connection); 
		done(); 
	}); 	
	after(function(done) {
		mongoose.disconnect(); 
		done();
	});
	describe('Generate a valid token when a user exists' , function() {
		before(function(done) {
			freeIdCtrl.generateNewId(function(err, newKey) {
				if (err) throw(err); 
				var citizenDataModel = new citizenModel({
					name : "test" 
					,secret : "secretKey" 
					,sex : "0"
					,birth : "12/02/1986"
				}); 
				citizenCtrl.addCitizen(citizenDataModel, function(err, citizenKey) {
					should.not.exist(err);
					should.exist(citizenKey); 
					done(); 
				});  
 
			});
		}); 

		after(function(done) {
			citizenCtrl.deleteAll(function(err, totalRemovedCitizens) {
				if (err) throw(err);
				freeIdCtrl.delAllFreeIdKeys(function(err, totalRemovedKeys) { 
					if (err) throw(err); 
					done(); 
				});
			});  
		}); 

		it('should generate a valid token', function(done) {
			authCtrl.tryToSignUser('test', 'secretKey', function(err, token) {	
				should.not.exist(err); 
				done(); 
			}); 
		});
		it('should validate a valid token', function(done) { 
			authCtrl.tryToSignUser('test', 'secretKey', function(err, token) {
					if (err) return done(err); 
				authCtrl.validateUserToken(token.token, function(err, decodedToken) {
					if(err) return done(err); 
					done(); 
				}); 
			}); 
		});
		it('should not generate token if user does not exists', function(done) {
			authCtrl.tryToSignUser('username', 'secretKey', function(err, token) { 
					should.exist(err); 
					err.message.should.equal("User not found");
					done();  
			});
		}); 
		it('should not validate an invalid token', function(done) {
			authCtrl.validateUserToken("123456", function(err, decodedToken) {
				should.exist(err); 
				err.message.should.equal("jwt malformed"); 
				done(); 
			}); 	
		});   
	});   
});
