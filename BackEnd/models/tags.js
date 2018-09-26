const express = require('express'),
	  pg = require('pg');

// build database connection string
const dbConnStr = process.env.DB_PROTOCOL + '://'+process.env.DB_USER+':'+process.env.DB_PASS +'@'+ process.env.DB_HOST + ':' + process.env.DB_PORT + '/' + process.env.DB_NAME;


// checks if a tag already exists in the database
function checkForTags(inputTagsArray,tagsTableArray,callback){
	console.log('inputTagsArray:   ',inputTagsArray)
	console.log('tagsTableArray:   ',tagsTableArray)

};

function insrtNewTagToDb(inputTagsArray,i,callback){
	console.log('\n insrtNewTagToDb \n')
	console.log('the inputTagsArray is : ',inputTagsArray)
	console.log('the i is : ',i)
	// connect to database
	const client = new pg.Client(dbConnStr);
	client.connect(function(err){
		if (err) {
			 console.log('error : ',err);
			 callback(err,null);
		}
	});
	SQL = "INSERT INTO tags(tagname) VALUES ($1) RETURNING id;";
	vars = [inputTagsArray[i][1]]
	// send to database
	client.query(SQL,(vars),function(err,result){
		if (err) {
			console.log('error : ',err);
			callback(err,null);
		} else { console.log('query ok');}
		inputTagsArray[i][0] = result.rows[0].id;
		console.log('the return value is : ',result.rows)
		console.log('the inputTagsArray is : ',inputTagsArray)
		// callback(null,inputTagsArray)
	});
}



// parses the comma seperated value string and creates a new array
function prepareIncommingTags(inputTags){
	console.log('\n prepareIncommingTags \n')
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

function getAllTagsFromDb(inputTagsArray,tagsTableArray,callback){
	console.log('\n getAllTagsFromDb \n')
	// connect to database
	const client = new pg.Client(dbConnStr);
	client.connect(function(err){
		if (err) {
			 console.log('error : ',err)
		   callback(err,null);
		}
	});
	// get the entire tags table to save on repeated calls
	SQL = "SELECT * FROM tags;";
	// send to database
	client.query(SQL,function(err,result){
        if (err) {
					console.log('error ',err)
			callback(err,null);
		} else {
			if(result.rows.length>0){
				// create a table out of the return
				for(i=0; i < result.rows.length; i++) {
					tagsTableArray[i] = new Array ( result.rows[i].id , result.rows[i].tagname );
				}
			}
			// when done return
			callback(null,inputTagsArray)
		}
	});
};




module.exports = {insrtNewTagToDb,prepareIncommingTags,getAllTagsFromDb};
