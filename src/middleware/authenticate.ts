import jwt from 'jsonwebtoken';

export function isAuthenticated  (req,res,next){
    const authHeader=req.get('Authorization');
    if(!authHeader){
        const error = new Error(`Not authenticated`);
        error['statusCode']=401;
        throw error;
    }
    const token = authHeader.split(' ')[1];
    let decodedToken;
    try {
        decodedToken= jwt.verify(token,'secret')
    } catch (error) {
        error.statusCode=500;
        throw error;
    }
    if(!decodedToken){
        const error=new Error(`Not authenticated`);
        error['statusCode']=401;
        throw error;
    }
    req.userId=decodedToken.userId;
    next();
}


//dodavanje tokena na frontu 
// add headers Authorization:'Bearer'+this.token