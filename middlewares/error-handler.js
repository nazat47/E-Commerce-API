const {StatusCodes}=require('http-status-codes')

const customErrorHandler=(err,req,res,next)=>{
    let customError={
        msg:err.message || 'Something went wrong',
        statusCode:err.statusCode || StatusCodes.INTERNAL_SERVER_ERROR
    }
    if(err.name==="CastError"){
        if(!err.value._id){
            customError.msg=`No item found with id ${err.value}`
        }
        customError.msg=`No item found with id ${err.value._id}`
        customError.statusCode=404
    }
    if(err.name==="UnauthorizedError"){
        customError.msg="User not authorized"
        customError.statusCode=StatusCodes.UNAUTHORIZED
    }
    return res.status(customError.statusCode).json({msg:customError.msg})
}
module.exports=customErrorHandler