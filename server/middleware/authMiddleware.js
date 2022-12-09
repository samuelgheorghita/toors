import jwt, { decode } from "jsonwebtoken";

export const authMiddleware = async (req, res, next) => {
  const token = req.cookies.token;

  if (!token) {
    return res.status(401).json({ errorMess: "No Token" });
  }

  try {
    const { email } = await jwt.verify(token, process.env.JWT_PRIVATE_KEY);
    res.locals.userEmail = email;
  } catch (error) {
    console.log(error);
    res.status(401).json({ errorMess: "Token expired" });
  }
  next();
};
