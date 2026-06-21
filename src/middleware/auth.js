const { verify } = require("jsonwebtoken")

async function auth (req, res, next){
    try{
       const {authorization} = req.headers

       if (!authorization) {
           return res.status(401).json({ message: 'Token não fornecido!' });
       }

       const token = authorization.split(' ')[1];
       req['payload'] = verify(token, process.env.SECRET_JWT)

       next()

    }catch(error){
        return res.status(401).json({message: "Token inválido!", cause: error.message})
    }

}

module.exports = {auth}