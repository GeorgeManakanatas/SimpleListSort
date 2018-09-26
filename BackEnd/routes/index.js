const
    express = require('express'),
	security = require('../middleware/security/security'),
    router = express.Router({mergeParams: true}),
	clientModel = require('../models/clients.js'),
	tagsModel = require('../models/tags.js'),
	associationModel = require('../models/association.js'),
	bodyParser = require('body-parser'),
	pg = require('pg'),
	dbConnStr = process.env.DB_PROTOCOL + '://'+process.env.DB_USER+':'+process.env.DB_PASS +'@'+ process.env.DB_HOST + ':' + process.env.DB_PORT + '/' + process.env.DB_NAME,
	client = new pg.Client(dbConnStr);


router.use(bodyParser.urlencoded({limit: '50mb', extended: true}));
router.use(bodyParser.json({limit: '50mb'}));
//==============================================================================
// General security process
//==============================================================================

router.use(security.security)


//==============================================================================
// General status
//==============================================================================
router.get('/check',
    function(req, res, next){
        res.status(200);
		res.json();
		next();
    }
);

//==============================================================================
// Get
//==============================================================================

// get all the entries
// GET http://localhost:8081/all)
router.get('/all',
    function(req, res, next) {
		res.status(200);
		res.json({'filter':'no filter'});
        next();
    }
);

// get the entries by name
// GET http://localhost:8081/name)
router.get('/name',
    function(req, res, next) {
		res.status(200);
        res.json({'filter':'filter by name'});
		next();
    }
);

// get the entries by tag
// GET http://localhost:8081/tags)
router.get('/tags',
    function(req, res, next) {
		res.status(200);
		res.json({'filter':'filter by tags'});
        next();
    }
);

//==============================================================================
// Post
//==============================================================================

// post an entry
// POST http://localhost:8081/client)
router.post('/client',
    function(req, res, next) {
		console.log('!!!!!!!!!!!!!!!!!!1')
		//
    console.log('\n processNewEntryTags \n')
  	inputTags = req.body.tags;
  	var inputTagsArray = tagsModel.prepareIncommingTags(inputTags)
  	var tagsTableArray = new Array ( );
    //
    // console.log('inputTagsArray  0  :   ',inputTagsArray)
  	// console.log('tagsTableArray  0  :   ',tagsTableArray)
		tagsModel.getAllTagsFromDb(inputTagsArray,tagsTableArray,function(err,tagsTableArray){
      // console.log('inputTagsArray  1  :   ',inputTagsArray)
  		// console.log('tagsTableArray  1  :   ',tagsTableArray)
      const client = new pg.Client(dbConnStr);
      client.connect(function(err){
        if (err) {
           console.log('error : ',err);
           callback(err,null);
        }
      });
      inputTagsArray.forEach(function(inputTagsArrayItem,index){
        // console.log('the inputTagsArray is : ',inputTagsArray)
    		if(!inputTagsArray[index][0]){
    			// console.log('for i : ',i,' the inputTagsArray[index] is ',inputTagsArray[index])
          console.log('\n insrtNewTagToDb \n')
        	console.log('the inputTagsArray is : ',inputTagsArray)
        	console.log('the i is : ',index)
        	// connect to database

        	SQL = "INSERT INTO tags(tagname) VALUES ($1) RETURNING id;";
        	vars = [inputTagsArray[index][1]]
        	// send to database
        	client.query(SQL,(vars),function(err,result){
        		if (err) {
        			console.log('error : ',err);
        			callback(err,null);
        		} else { console.log('query ok');}
        		inputTagsArray[index][0] = result.rows[0].id;
        		console.log('the return value is : ',result.rows)
        		console.log('the inputTagsArray is : ',inputTagsArray)
        		// callback(null,inputTagsArray)
        	});

          // tagsModel.insrtNewTagToDb(inputTagsArray,index,function(err,inputTagsArray){
    			// 	if(err){
    			// 		console.log('error : ',err)
    			// 	} else{
    			// 		req.body.tags = inputTagsArray;
    			// 	}
          //   console.log('end is req.body : ',req.body)
          //   next();
    			// })
    		}
      })
      req.body.tags = inputTagsArray;
      // next();
		});// end of processNewEntryTags
    next();
	},
  function(req, res, next) {
    // save the rest of the body
    console.log('!!!!!!!!!!!!!!!!!!2')
    clientModel.createClient(data, function(err, result){
      if (err) {
        //res.status(500).send(err);
         next();
      } else if(!result){
        //res.status(404).send('Error trying to save body to database');
         next();
      } else {
        data.id = result.id;
        console.log('--------------------------------->',data)
        req.body.id = data.id;
        next();
      };
    });// end of createClient
  }
  // function(req, res, next) {
  //   // create associations
  //   console.log('!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!3')
  //   associationModel.createAssociationEntries(data,function(err, result){
  //     if (err) {
  //       //res.status(500).send(err);
  //        next();
  //     } else if(!result){
  //       //res.status(404).send('Error trying to save associations to database');
  //        next();
  //     } else {
  //       res.status(200).send(result);
  //     };
  //   });// end of createAssociationEntries
  // }
);

//==============================================================================
// Delete
//==============================================================================

// delete an entry
// DELETE http://localhost:8081/)
router.delete('/',
    function(req, res, next) {

        next();
    }
);

module.exports = router;
