

function security(req, res, next){
	console.log('\nSome security check!\n')
    next();
}

module.exports = {security};
