import dotenv from "dotenv";

dotenv.config();

export const adminMiddleware = (req, res, next) => {
  const adminUsername = process.env.ADMIN_USERNAME;
  const adminPassword = process.env.ADMIN_PASSWORD;
  console.log(adminUsername);
  console.log(adminPassword);

  if (req.query.adminUsername === adminUsername && req.query.adminPassword === adminPassword) {
    next();
  } else {
    res.status(401).json({ mess: "Access Denied" });
  }
};
