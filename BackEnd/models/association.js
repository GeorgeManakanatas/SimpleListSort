const express = require('express'),
	  pg = require('pg');

// build database connection string
const dbConnStr = process.env.DB_PROTOCOL + '://'+process.env.DB_USER+':'+process.env.DB_PASS +'@'+ process.env.DB_HOST + ':' + process.env.DB_PORT + '/' + process.env.DB_NAME;

// creates association between tag and client
function createAssociationEntry(tagId,entryId){
	return new Promise(function(resolve,reject){
		const client = new pg.Client(dbConnStr);
		client
			.connect()
			.then(function(){
				SQL = "INSERT INTO association(tagid,agencyid) VALUES ($1 , $2) RETURNING id;";
				vars = [tagId,entryId]
				return client.query(SQL,(vars));
			})
			.then(function(result){

				resolve();
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




			// send to database
			client.query(SQL,(vars),function(err,result){
				if (err) {
					callback(err,null);
				}
			});

};

// terutns all the tags ids
function findAllAssociatedTags(){

};

module.exports = {createAssociationEntry};
