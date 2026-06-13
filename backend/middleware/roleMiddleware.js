/**
 * Restricts access to specific user roles
 * @param  {...string} allowedRoles - Roles allowed to access the route ('customer', 'vendor', 'superadmin')
 */
const restrictTo = (...allowedRoles) => {
  return (req, res, next) => {
    
    // This must be placed AFTER authMiddleware in your route chain!
    if (!req.user) {
      return res.status(401).json({ msg: "Authentication required before role verification." });
    }

    if (!allowedRoles.includes(req.user.role)) {
      return res.status(403).json({ 
        msg: `Access Denied: Your account role (${req.user.role}) does not have permission to perform this action.` 
      });
    }

    next(); 
  };
};

module.exports = { restrictTo };