const express = require('express'),
	  pg = require('pg');

// build database connection string
const dbConnStr = process.env.DB_PROTOCOL + '://'+process.env.DB_USER+':'+process.env.DB_PASS +'@'+ process.env.DB_HOST + ':' + process.env.DB_PORT + '/' + process.env.DB_NAME;

// creates association between tag and client
function createAssociationEntries(data,callback){
	entryId = data.id;
	inputTags = data.tags;
	// create entry for every tag
	for(i=0; i < inputTags.length-1; i++) {

		// connect to database
			const client = new pg.Client(dbConnStr);
			client.connect(function(err){
				if (err) {
				   callback(err,null);
				}
			});
			SQL = "INSERT INTO association(tagid,agencyid) VALUES ($1 , $2) RETURNING id;";
			vars = [inputTags[i][0],entryId]
			// send to database
			client.query(SQL,(vars),function(err,result){
				if (err) {
					callback(err,null);
				}
			});
	}
	callback(null,data)
};

// terutns all the tags ids
function findAllAssociatedTags(){

};

module.exports = {createAssociationEntries};
