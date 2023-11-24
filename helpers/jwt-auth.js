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
      { url: /\/api\/v1\/orders(.*)/, methods: ["GET", "OPTIONS", "POST"] },
      `/api/v1/auth/login`,
      `/api/v1/auth/register`,
      `/`,
      `/api-doc`
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
