
const jwt = require('jsonwebtoken')


const authSeller = async(req,res,next) =>{
    const {sellerToken} = req.cookies;
    if(!sellerToken) return res.status(401).json({
        success:false,
        message:"Not authorized"
    })
     try {
            const tokenDecode = jwt.verify(sellerToken,process.env.JWT_SECRET)
            if(tokenDecode.email === process.env.SELLER_EMAIL){
               next()
            }else{
                return res.status(401).json({
                    success:false,
                    message:"Not Authorized"
                })
            }
             
        } catch (error) {
            console.log(error)
            return res.status(500).json({
                success:false,
                message:error.message
    
            })
            
        }
    
    }
module.exports = authSeller;