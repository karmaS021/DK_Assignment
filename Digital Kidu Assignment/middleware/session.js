const requireSession = (req, res, next) => {
  if (!req.session.userId) {
    return res.redirect('/');
  }
  next();
};

module.exports = requireSession;
