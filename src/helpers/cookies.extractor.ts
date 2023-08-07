export const cookieExtractor = function(req) {
  var token = null;
  if (req && req.cookies) {
    token = req.cookies.refreshToken;
  }
  return token;
};