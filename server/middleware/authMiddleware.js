import jwt, { decode } from "jsonwebtoken";

export const authMiddleware = async (req, res, next) => {
  const authorization = req.headers.authorization;

  if (!authorization) {
    return res.status(401).json({ errorMess: "No Token" });
  }

  const token = authorization.split(" ")[1];
  const { exp, iat } = jwt.decode(token);

  // If (expiration date - issue at date) < 2 days ===> Then it's an access token
  if (exp - iat < 172800) {
    try {
      const { sub } = await jwt.verify(token, process.env.JWT_ACCESS_TOKEN_KEY);
      res.locals.userId = sub;
      next();
    } catch (error) {
      console.log(error);
      res.status(401).json({ errorMess: "Access Token expired" });
    }
  } else {
    // Otherwise it's a refresh token
    try {
      const { sub } = await jwt.verify(token, process.env.JWT_REFRESH_TOKEN_KEY);
      res.status(200).json({ mess: "PERFECT!!!!!!!!!!" });
    } catch (error) {
      console.log(error);
      res.status(403).json({ mess: "Something went wrong" });
    }
  }
};
