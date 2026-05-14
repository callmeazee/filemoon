const jwt = require('jsonwebtoken');

const AuthMiddleware = async(req, res, next) => {
   
     try {
          const { authorization } = req.headers;
          //checking authorization key exist or not
           if (!authorization)
             return res
               .status(401)
               .json({ message: "Authorization token is required" });

          const [type, token] = authorization.split(" ");
          
          //checking token type is Bearer or not
           if (type !== "Bearer")
               return res.status(401).json({ message: "Invalid token type" });

          //verifying token and extracting user data
          const user = await jwt.verify(token, process.env.JWT_SECRET);

          //injecting user data to request object
          req.user = user;
          
          //forwarding the req to controller
          next();
     } catch (err) {
          res.status(401).json({ message: "Invalid request" });
          // this is authentication error not server error so status code is 401 not 500
     }
   


}

module.exports = AuthMiddleware


     /* 
         const [type, token] = authorization.split(" ");    ---> this is senior level array destructuring method 

         const type = authorization.split(" ")[0]  ---> this is junior level method
         const token = authorization.split(" ")[1]  ---> this is junior level method

         const auth = authorization.split(" ")  ---> this is junior level method
         const type = auth[0]  ---> this is junior level method
         const token = auth[1]  ---> this is junior level method
          
     */





/* 
1: firstly check authorization key is recieved or not if not then return 401 error
2:  check the token type is Bearer or not if not then return 401 error
3: validate token using secret key if token is valid then attach user data to request object and call next() to pass control to next middleware or route handler otherwise return 401 error
4:  inject user payload to request object so that it can be accessed in subsequent middlewares or route handlers for authorization or other purposes
5: forward the req to controller

Authorization:Bearer 863a6067a765c83bbbe073c460656284f9c236ff8c45107623d58b3d7734d423

*/