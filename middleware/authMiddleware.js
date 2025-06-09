// backend/middleware/authMiddleware.js

exports.ensureAuthenticated = (req, res, next) => {
  if (req.session && req.session.isAuthenticated) {
    return next();
  }
  res.redirect('/login');
};

exports.ensureAdmin = (req, res, next) => {
  if (
    req.session &&
    req.session.isAuthenticated &&
    req.session.user &&
    req.session.user.role === 'Admin'
  ) {
    return next();
  }
  res.status(403).send('Admin access only');
};
