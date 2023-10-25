const CustomError = require('../errors');
const { isTokenValid } = require('../utils');

const authenticateUser = (req, res, next) => {
  const token = req.signedCookies.token;
  if (!token) {
    throw new CustomError.UnauthenticatedError('authentication invalid');
  }
  try {
    const { name, userId, role } = isTokenValid({ token });
    req.user = { name, userId, role };
    next();
  } catch (error) {
    throw new CustomError.UnauthenticatedError('authentication invalid');
  }
};

const authorizePermissions = (...rest) => {
  return (req, res, next) => {
    if (!rest.includes(req.user.role)) {
      throw new CustomError.UnauthorizedError(
        'unauthorized to access this route'
      );
    }
    next();
  };
};

module.exports = { authenticateUser, authorizePermissions };
