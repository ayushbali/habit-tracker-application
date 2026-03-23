// when we created a habit earlier, we had to manually copy and paste the User ID into the JSON body. In a real app, the server should automatically know who the user is based on the token.

// two.
// one.
// one.

import jwt from "jsonwebtoken";
import User from "./../models/User.js";

// This middleware will be used to protect routes that require authentication. It will check if the token is valid and if the user exists in the database. If everything is fine, it will attach the user object to the request object and call the next middleware. If not, it will return an error response.

export const authMiddleware = async (req, res, next) => {
  let token;

  const test = "Bearer testString";
  console.log(test.startsWith("Bearer") ? test.split(" ")[1] : null);

  // check if the request has an authorization header that starts with "Bearer"
  if (
    req.headers.authorization &&
    req.headers.authorization.startsWith("Bearer")
  ) {
    try {
      console.log(`This is the request headers: ${req.headers.authorization}`);
      // get the token from the authorization header
      token = req.headers.authorization.split(" ")[1];

      const testToken = token;
      console.log(`This is the token: ${token} ---- token`);

      // verify the token
      const decoded = jwt.verify(token, process.env.JWT_SECRET, {
        algorithms: ["HS256"],
      });

      // fetch the user from the database using the id inside the decoded token
      // .select('-password') ensures that the password field is not included in the user object that we attach to the request object. This is a security measure to prevent the password hash from being exposed in case of a bug or a leak.
      req.user = await User.findById(decoded.id).select("-password");
      console.log(
        `This is the decoded token: TYPE: ${typeof decoded} ---- ${JSON.stringify(decoded)}`,
      );
      // the token is valid and the user exists, so we can call the next middleware
      next();
    } catch (error) {
      console.error("Error in authMiddleware:", error);
      return res.status(401).json({
        message: "Unauthorized",
      });
    }
  }

  if (
    !req.headers.authorization ||
    !req.headers.authorization.startsWith("Bearer")
  ) {
    console.log(`request headers: ${req.headers}`);
    console.log(`request headers: ${req.headers.authorization}`);
    console.log(`token: ${token}`);

    return res.status(401).json({
      message: "Unauthorized",
    });
  }

  // if no token is found in the authorization header, return an error response
  if (!token) {
    console.log(`request headers: ${req.headers}`);
    return res.status(401).json({
      message: "Unauthorized, no token",
    });
  }
};
