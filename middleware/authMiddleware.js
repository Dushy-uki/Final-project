import jwt from 'jsonwebtoken';

// ✅ Middleware: Verify JWT Token (a.k.a. "protect")
export const verifyToken = (req, res, next) => {
  const authHeader = req.headers.authorization;

  if (!authHeader || !authHeader.startsWith('Bearer ')) {
    return res.status(401).json({ error: 'Unauthorized: No token provided' });
  }

  const token = authHeader.split(' ')[1];

  try {
    const decoded = jwt.verify(token, process.env.JWT_SECRET);
    req.user = decoded; // decoded: { id, role }
    next();
  } catch (err) {
    return res.status(401).json({ error: 'Unauthorized: Invalid token' });
  }
};

// Alias for consistency with other projects (optional)
export const protect = verifyToken;

// ✅ Role-based Access Control

export const isAdmin = (req, res, next) => {
  if (req.user?.role === 'admin') {
    return next();
  }
  return res.status(403).json({ error: 'Access denied: Admins only' });
};

export const isProvider = (req, res, next) => {
  if (req.user?.role === 'provider') {
    return next();
  }
  return res.status(403).json({ error: 'Access denied: Providers only' });
};

export const isUser = (req, res, next) => {
  if (req.user?.role === 'user') {
    return next();
  }
  return res.status(403).json({ error: 'Access denied: Users only' });
};
