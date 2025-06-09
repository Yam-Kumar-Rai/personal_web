require('dotenv').config();

exports.login = (req, res) => {
  const { email, password } = req.body;

  const adminEmail = process.env.ADMIN_EMAIL;
  const adminPass = process.env.ADMIN_PASS;

  if (!email || !password) {
    return res.status(400).json({ message: 'Email and password are required' });
  }

  if (email === adminEmail && password === adminPass) {
    req.session.isAuthenticated = true;
    req.session.user = {
      id: email,
      role: 'Admin',
    };

    return res.status(200).json({ message: 'Login successful', redirectURL: '/Admin/dashboard' });
  } else {
    return res.status(401).json({ message: 'Invalid credentials' });
  }
};

exports.logout = (req, res) => {
  req.session.destroy(err => {
    if (err) {
      return res.status(500).json({ message: 'Logout failed' });
    }
    res.clearCookie('connect.sid');
    return res.status(200).json({ message: 'Logged out successfully' });
  });
};
