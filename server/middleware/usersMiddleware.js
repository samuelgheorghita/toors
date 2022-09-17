import jwt, { decode } from "jsonwebtoken";

export const usersMiddleware = async (req, res, next) => {
  const token = req.cookies.token;
  console.log("inside middleware");

  if (!token) {
    return res.status(404).json({ errorMess: "No Token" });
  }

  try {
    const { email } = await jwt.verify(token, process.env.JWT_PRIVATE_KEY);
    req.user = email;
  } catch (error) {
    console.log(error);
    res.status(404).json({ errorMess: "Token expired" });
  }

  next();
};
