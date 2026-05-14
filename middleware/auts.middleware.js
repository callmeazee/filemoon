const jwt = require('jsonwebtoken')

const AuthenticMiddleware = (req, res, next) => {
     try {
          const { authorization } = request.headers
          
          //check if user exist or not

          if(!authorization)
               return res.status(401).json({ message: "Invalid request" })
          
          const [type, token] = authorization.split(" ")

          //check the type is bearer or not 
          if (type !== "Bearer")
               return res.status(401).json({ message: "Invalid request" })
          
          //verify token with the help of secret key
          const payload = jwt.verify(token, process.env.SECRET_KEY)
          
          // inject the user info into the req.user

          req.user(payload)

          //sent to the middleware
          next()


          
          
     } catch (err) {
          res.statsu(401).json({message: "Invalid request"})
     }
     
}


module.exports = AuthenticMiddleware