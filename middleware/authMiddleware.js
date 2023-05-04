const jwt = require('jsonwebtoken');
const config = process.env;

const authMiddleware = (req, res, next) => {
  const { authorization } = req.headers;

  if (!authorization) {
    return res
      .status(400)
      .json({ message: 'Please, provide authorization header' });
  }

  const [, token] = authorization.split(' ');

  if (!token) {
    return res
      .status(400)
      .json({ message: 'Please, include token to request' });
  }
  try {
    const decoded = jwt.verify(token, config.TOKEN_KEY);

    req.user = {
      _id: decoded.user_id,
    };
  } catch (err) {
    return res.status(400).send('Invalid Token');
  }
  return next();
};

module.exports = {
  authMiddleware,
};
