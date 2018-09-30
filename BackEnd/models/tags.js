const express = require('express'),
	  pg = require('pg');

// build database connection string
const dbConnStr = process.env.DB_PROTOCOL + '://'+process.env.DB_USER+':'+process.env.DB_PASS +'@'+ process.env.DB_HOST + ':' + process.env.DB_PORT + '/' + process.env.DB_NAME;


function insertNewTagToDb(inputTag){
	return new Promise(function(resolve,reject){
		const newTag = inputTag;
		const client = new pg.Client(dbConnStr);
		console.log('promice step 0 : inputTag ',inputTag)
		client
			.connect()
			.then(function(){
				SQL = "INSERT INTO tags(tagname) VALUES ($1) RETURNING id;";
				vars = [newTag]
				return client.query(SQL,(vars));
			})
			.then(function(result){
				resolve(result.rows[0].id);
			},function(err){
				console.log('promise error :',err)
				reject(err);
			})
			.then(function(){
				console.log('promice step 3')
				if (client){
					return client.end();
				}
			})
			.then(function(){
				console.log('db connection closed')
			})
			.catch(function(err){
        console.log('Error closing connection', err);
      });
		});
}

// parses the comma seperated value string and creates a new array
function createTagArray(inputTags){
	var inputTagsArray = new Array ( );
	// parse tags from string
	var tempArray = inputTags.split(',')
	//remove whitespaces and lowercase everything
	for(i=0; i < tempArray.length; i++) {
		trimmed = tempArray[i].replace(/\s/g, "");
		lowercase = trimmed.toLowerCase();
		inputTagsArray[i] = new Array ( null , lowercase );
	}
	return inputTagsArray
};

// search database for existing tags
function getTagsFromDb(inputTagsArray){
	return new Promise(function(resolve,reject){
		const client = new pg.Client(dbConnStr);
		client
			.connect()
			.then(function(){
				// build the SQL query string
				SQL = "SELECT * FROM tags WHERE"
				for(i=0;i<inputTagsArray.length;i++){
					if(i === 0){
						SQL = SQL+" tagname LIKE '"+inputTagsArray[i][1]+"'"
					}else{
						SQL = SQL+" OR tagname LIKE '"+inputTagsArray[i][1]+"'"
					}
				}
				return client.query(SQL);
			})
			.then(function(result){
				// attach all the found tag ids
				for(i=0;i<result.rows.length;i++){
					for(j=0;j<inputTagsArray.length;j++){
						if(inputTagsArray[j][1]===result.rows[i].tagname){
							inputTagsArray[j][0]=result.rows[i].id;
							break;
						};
					};
				};
				resolve(inputTagsArray);
			},function(err){
				reject(err);
			})
			.then(function(){
				if (client){
					return client.end();
				}
			})
			// .then(function(){
			// 	console.log('db connection closed')
			// })
			.catch(function(err){
				console.log('Error closing connection', err);
			});
	})
};




module.exports = {insertNewTagToDb,createTagArray,getTagsFromDb};
