exports.isAuthenticated = (req, res, next) => {
  if (req.session && req.session.isAuthenticated) {
    next();
  } else {
    res.status(401).json({ message: 'You must be logged in' });
  }
};

exports.isAdmin = (req, res, next) => {
  if (req.session && req.session.user && req.session.user.role === 'Admin') {
    next();
  } else {
    res.status(403).json({ message: 'Access denied. Admins only.' });
  }
};
