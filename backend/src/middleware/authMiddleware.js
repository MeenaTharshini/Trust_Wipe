import jwt from "jsonwebtoken";

const authMiddleware = (req, res, next) => {
  const authHeader = req.headers.authorization;

  console.log("========== AUTH ==========");
console.log("METHOD :", req.method);
console.log("URL    :", req.originalUrl);
console.log("HEADER :", authHeader);
console.log("==========================");

  if (!authHeader || !authHeader.startsWith("Bearer ")) {
    return res.status(401).json({ message: "No Token" });
  }

  const token = authHeader.split(" ")[1];

  try {
    const decoded = jwt.verify(token, process.env.JWT_SECRET);

    console.log("DECODED USER:", decoded); // ✅ DEBUG

    req.user = decoded;

    next();
  } catch (error) {
    console.log("JWT ERROR:", error.message);
    return res.status(401).json({ message: "Invalid Token" });
  }
};

export default authMiddleware;