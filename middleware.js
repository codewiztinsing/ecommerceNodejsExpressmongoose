function cors (req, res, next) {
    const origin = req.headers.origin
    res.setHeader('Access-Control-Allow-Origin', origin || '*')
    res.setHeader(
    'Access-Control-Allow-Methods',
    'POST, GET, PUT, DELETE, OPTIONS, XMODIFY'
    )
    res.setHeader('Access-Control-Allow-Credentials', 'true')
    res.setHeader('Access-Control-Max-Age', '86400')
    res.setHeader(
    'Access-Control-Allow-Headers',
    'X-Requested-With, X-HTTP-Method-Override, Content-Type, Accept'
    )
next()
}

function handleError(err,req,res,next){
    if(res.headerSent) next(err);
    console.log(err);
    res.status(500).json({error:'internal error'})
}

function notFound(req,res){
    res.status(400).json({error:"not found"})
}

module.exports = {cors,handleError,notFound}