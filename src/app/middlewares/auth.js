import jwt from "jsonwebtoken";
import authConfig from "../../config/auth";

function authMiddleware(request, response, next) {
  const authToken = request.headers.authorization;

  if (!authToken) {
    return response.status(401).json({ error: "Token not provided" });
  }

  const token = authToken.split(" ").at(1);

  try {
    const decoded = jwt.verify(token, authConfig.secret);
    request.userId = decoded.id;
    request.userName = decoded.name;
  } catch (err) {
    return response.status(401).json({ error: "Token is invalid" });
  }

  return next();
}

export default authMiddleware;
