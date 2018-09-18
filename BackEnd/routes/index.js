const
    express = require('express'),
    router = express.Router({mergeParams: true});

//==============================================================================
// General status
//==============================================================================
router.get('/status',
    function(req, res){
        return res.status(200).send();
    }
);

//==============================================================================
// Get
//==============================================================================

// get all the entries
// GET http://localhost:8081/)
router.get('/',

    function(req, res, next) {

        next();
    }
);



//==============================================================================
// Post
//==============================================================================

// post an entry
// POST http://localhost:8081/)
router.post('/',

    function(req, res, next) {

        next();
    }
);

//************************************
// for routes that have /:entryId  **
//************************************
router.use('/:entryId',
    function(req, res, next) {

        next();
    }
);

// get the entries by name
// GET http://localhost:8081/:entryId)
router.get('/',

    function(req, res, next) {

        next();
    }
);

// get the entries by tag
// GET http://localhost:8081/)
router.get('/',

    function(req, res, next) {

        next();
    }
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
