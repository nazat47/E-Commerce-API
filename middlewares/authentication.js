const jwt=require('jsonwebtoken')
const Unauthenticated=require('../errors/unauthenticated')
require('dotenv')

const authentication=async (req,res,next)=>{
    const header=req.headers.authorization
    if(!header || !header.startsWith("Bearer")){
        throw new Unauthenticated("Invalid request")
    }
    const token=header.split(" ")[1]
    try {
        const decode= jwt.verify(token,process.env.JWT_SECRET)
        req.user={
        name:decode.name,
        id:decode.userId,
        email:decode.email
        }
        next()
    } catch (error) {
        throw new Unauthenticated("Authentication failed")
    }
}
module.exports=authentication