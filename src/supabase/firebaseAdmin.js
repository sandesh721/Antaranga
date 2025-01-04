const admin = require("firebase-admin");
const serviceAccount = require("./antaranga-fd.json");

admin.initializeApp({
  credential: admin.credential.cert(serviceAccount),
});

module.exports = admin;
