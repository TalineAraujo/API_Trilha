const { verify } = require("jsonwebtoken")

async function auth (req, res, next){
    try{
       const {authorization} = req.headers

       req['payload'] = verify(authorization, process.env.SECRET_JWT )

       next()

    }catch(error){
        return res.status(401).json({message: "Token inválido!", cause: error.message})
    }

}

module.exports = {auth}