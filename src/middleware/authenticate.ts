function isAuth (req,res,next){
    if(!res.session){
        return res.send({
            message:`Not Loggeed In`
        })
    }
    next();
}

export default isAuth;