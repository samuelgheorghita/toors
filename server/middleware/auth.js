import jwt, { decode } from "jsonwebtoken";

export const authMiddleware = async (req, res, next) => {
  try {
    const token = req.headers.authorization;
    console.log("token1: " + token);

    if (!token) {
      return res.status(404).json({ errorMess: "No Token" });
    }

    try {
      const decoded = await jwt.verify(token, process.env.JWT_PRIVATE_KEY);
    } catch (error) {
      console.log(error);
      res.status(404).json({ errorMess: "Token expired" });
    }

    next();
  } catch (error) {
    console.log(error);
  }
};
