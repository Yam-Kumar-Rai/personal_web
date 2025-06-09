// controllers/adminController.js
exports.dashboard = (req, res) => {
  res.send(`Welcome to the Admin Dashboard, user id: ${req.session.userId}`);
};
