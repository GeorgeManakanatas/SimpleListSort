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
// GET http://localhost:8081/:name)
router.get('/:name',
    function(req, res, next) {
		res.status(200);
        res.json({'filter':'filter by name'});
		next();
    }
);

// get the entries by tag
// GET http://localhost:8081/tags)
router.get('/:tags',
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
      // process the tags
      inputTagsArray = tagsModel.createTagArray(req.body.tags)
    	tagsModel.getTagsFromDb(inputTagsArray)
        .then(function(result){
            inputTagsArray.forEach(function(inputTagsArrayItem,index){
              // if no id create entry for the tag
              if(!inputTagsArray[index][0]){
                tagsModel.insertNewTagToDb(inputTagsArray[index][1])
                  .then(function(result){
                    inputTagsArray[index][0] = result
                    req.body.tags = inputTagsArray;
                  })
              } else {
                req.body.tags = inputTagsArray;
              }
            })
          })
          .catch(function(err){
    				console.log('Error ', err);
    			})
          .then(function(){
            next()
          })
    },
    function(req, res, next) {
      // process the body
      clientModel.createClient(req.body)
        .then(function(result){
          console.log('!!!!!!!!!',result)
        })
        .catch(function(err){
          console.log('Error ', err);
        })
        .then(function(){
          next();
        })
    },
    function(req, res, next) {
      req.body.tags = inputTagsArray;
      // create associations
      inputTagsArray.forEach(function(inputTagsArrayItem,index){
        associationModel.createAssociationEntry(inputTagsArray[index][0],req.body.id)
          .then(function(result){
            console.log('association: ',inputTagsArray[index][0],req.body.id,' created')
          })
          .catch(function(err){
            console.log('Error ', err);
          })
          .then(function(){
            next();
          })
        })
      },
      function(req, res, next) {
    		res.status(200);
    		res.json(req.body);
        next();
      });


//==============================================================================
// Delete
//==============================================================================

// delete an entry
// DELETE http://localhost:8081/:name)
router.delete('/:name',
    function(req, res, next) {

        next();
    }
);

module.exports = router;
