const admin = require("./firebaseAdmin");

const setAdminRole = async (email) => {
  try {
    // Fetch user by email
    const user = await admin.auth().getUserByEmail(email);

    // Set custom claims (admin role)
    await admin.auth().setCustomUserClaims(user.uid, { role: "admin" });

    console.log(`Admin role assigned to user with email: ${email}`);
  } catch (error) {
    console.error("Error setting admin role:", error);
  }
};

// Call this function with the admin email
setAdminRole("");
