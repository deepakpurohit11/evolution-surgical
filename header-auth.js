// header-auth.js — Handles Login button in header
// Requires firebase-config.js and auth.js to be loaded first

function initHeaderAuth() {
  var btn   = document.getElementById("account-btn");
  var label = document.getElementById("account-label");

  if (!btn || !label) {
    setTimeout(initHeaderAuth, 100);
    return;
  }

  // Update label on auth state change
  firebase.auth().onAuthStateChanged(function(user) {
    if (user) {
      label.textContent = user.email.split("@")[0];
      btn.title = "Logged in as " + user.email;
    } else {
      label.textContent = "Login";
      btn.title = "Login / Sign Up";
    }
  });

  // Bind click
  btn.addEventListener("click", function() {
    var user = firebase.auth().currentUser;
    if (user) {
      var action = confirm("Logged in as " + user.email + "\n\nClick OK to logout, or Cancel to stay.");
      if (action) {
        firebase.auth().signOut().then(function() {
          label.textContent = "Login";
        });
      }
    } else {
      openAuthModal(function() {
        // label auto-updates via onAuthStateChanged
      });
    }
  });
}

setTimeout(initHeaderAuth, 200);
