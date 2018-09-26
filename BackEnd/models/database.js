const express = require('express'),
	  pg = require('pg'),
	  fs = require('fs'),
	  dbInit = require('../config/dbInit.json');

// build database connection string
const dbConnStr = process.env.DB_PROTOCOL + '://'+process.env.DB_USER+':'+process.env.DB_PASS +'@'+ process.env.DB_HOST + ':' + process.env.DB_PORT + '/' + process.env.DB_NAME;


function setupDbTables(){
	console.log('initializing db')
	// connect
	const client = new pg.Client(dbConnStr);
	client.connect(function(err){
		if (err) {
		   console.log('Connection to database error:', err);
		} else {console.log('connected');}
	});

	client.query(dbInit.agenciesTable.toString(),function(err){
		if (err) {
			console.log('error:', err);
		}
		console.log('query1 done');
	});
	client.query(dbInit.tagsTable.toString(),function(err){
		if (err) {
			console.log('error:', err);
		} else {console.log('query2 done');}

	});
	client.query(dbInit.associationTable.toString(),function(err){
		if (err) {
			console.log('error:', err);
		}
		console.log('query3 done');
	});

	// client.end()
};


module.exports = {setupDbTables};
