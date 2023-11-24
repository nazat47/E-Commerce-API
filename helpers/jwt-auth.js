const { expressjwt: jwt } = require("express-jwt");

function authjwt() {
  const secret = process.env.JWT_SECRET;
  return jwt({
    secret,
    algorithms: ["HS256"],
    isRevoked: isRevoked,
  }).unless({
    path: [
      { url: /\/public\/uploads(.*)/, methods: ["GET", "OPTIONS"] },
      { url: /\/api\/v1\/products(.*)/, methods: ["GET", "OPTIONS"] },
      { url: /\/api\/v1\/categories(.*)/, methods: ["GET", "OPTIONS"] },
      `/api/v1/auth/login`,
      `/api/v1/auth/register`,
       `/`,
    ],
  });
}

async function isRevoked(req, payload) {
  if (!payload.isAdmin) {
    return true;
  }
  return false;
}

module.exports = authjwt;
