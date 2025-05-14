export function requireAuth(...routes) {
  return function (req, res, next) {
    // Check if the request is for one of the specified routes
    if (routes.length && !routes.includes(req.path)) {
      return next();
    }
    console.log(req.session);
    const username = req.session.username;
    if (!username) {
      return res.redirect('/unauthorized.html');
    }
    return next();
  };
}
