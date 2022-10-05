import jwt, { decode } from "jsonwebtoken";

export const authMiddleware = async (req, res, next) => {
  const token = req.cookies.token;
  console.log("inside middleware");
  console.log("token: " + token);

  if (!token) {
    return res.status(402).json({ errorMess: "No Token" });
  }

  try {
    const { email } = await jwt.verify(token, process.env.JWT_PRIVATE_KEY);
    req.user = email;
  } catch (error) {
    console.log(error);
    res.status(403).json({ errorMess: "Token expired" });
  }

  next();
};
