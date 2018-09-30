const express = require('express'),
	  pg = require('pg');

// build database connection string
const dbConnStr = process.env.DB_PROTOCOL + '://'+process.env.DB_USER+':'+process.env.DB_PASS +'@'+ process.env.DB_HOST + ':' + process.env.DB_PORT + '/' + process.env.DB_NAME;

// create client entry
function createClient(requestBody){
	return new Promise(function(resolve,reject){
		const client = new pg.Client(dbConnStr);
		client
			.connect()
			.then(function(){
				SQL = "INSERT INTO agencies(name, description, grade) VALUES ($1, $2, $3) RETURNING id";
				vars = [requestBody.name.toString(), requestBody.description.toString(), requestBody.grade.toString()]
				return client.query(SQL,(vars));
			})
			.then(function(result){
				requestBody.id = result.rows[0].id;
				resolve(requestBody);
			},function(err){
				reject(err);
			})
			.then(function(){
				if (client){
					return client.end();
				}
			})
			.catch(function(err){
				console.log('Error closing connection', err);
			});
	})


	//

	// send to database
	client.query(SQL,(vars),function(err,result){
        if (err) {
			console.log('Connection to database error:', err);
			callback(err,null);
		} else {
			requestBody.id = result.rows[0].id;

		}
	});
};

// edit client entry
function editClient(){

};

// removes client and associations
function removeClient(){

};

module.exports = {createClient};
