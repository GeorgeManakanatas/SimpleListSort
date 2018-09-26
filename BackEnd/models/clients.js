const express = require('express'),
	  pg = require('pg');

// build database connection string
const dbConnStr = process.env.DB_PROTOCOL + '://'+process.env.DB_USER+':'+process.env.DB_PASS +'@'+ process.env.DB_HOST + ':' + process.env.DB_PORT + '/' + process.env.DB_NAME;

// create client entry
function createClient(inputJson,callback){

	const client = new pg.Client(dbConnStr);
	client.connect(function(err){
		if (err) {
		   callback(err,null);
		}
	});
	//
	SQL = "INSERT INTO agencies(name, description, grade) VALUES ($1, $2, $3) RETURNING id";
	vars = [inputJson.name.toString(), inputJson.description.toString(), inputJson.grade.toString()]
	// send to database
	client.query(SQL,(vars),function(err,result){
        if (err) {
			console.log('Connection to database error:', err);
			callback(err,null);
		} else {
			inputJson.id = result.rows[0].id;
			callback(null,inputJson);
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
