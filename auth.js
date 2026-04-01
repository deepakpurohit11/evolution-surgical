// ============================================================
// auth.js — Login/Signup modal using Firebase compat SDK
// Relies on firebase-config.js being loaded first
// ============================================================

function openAuthModal(onSuccessCallback) {
  let modal = document.getElementById("auth-modal");
  if (!modal) {
    modal = createAuthModal();
    document.body.appendChild(modal);
    bindAuthModalEvents();
  }
  modal.style.display = "flex";
  modal._onSuccess = onSuccessCallback || null;
}

function closeAuthModal() {
  const modal = document.getElementById("auth-modal");
  if (modal) modal.style.display = "none";
}

function createAuthModal() {
  const modal = document.createElement("div");
  modal.id = "auth-modal";
  modal.innerHTML = `
    <div class="auth-box">
      <button class="auth-close" id="auth-close-btn">✕</button>
      <div class="auth-logo">
        <img src="images/company_logo.jpeg" alt="Evolution Surgical">
      </div>
      <div class="auth-tabs">
        <button class="auth-tab active" data-tab="login">Login</button>
        <button class="auth-tab" data-tab="signup">Sign Up</button>
      </div>

      <!-- LOGIN -->
      <div class="auth-form-wrap" id="login-form-wrap">
        <div class="auth-field">
          <label>Email</label>
          <input type="email" id="login-email" placeholder="you@email.com" autocomplete="email">
        </div>
        <div class="auth-field">
          <label>Password</label>
          <input type="password" id="login-password" placeholder="Enter password">
        </div>
        <div class="auth-error" id="login-error"></div>
        <button class="auth-submit-btn" id="login-submit-btn">Login</button>
      </div>

      <!-- SIGNUP -->
      <div class="auth-form-wrap" id="signup-form-wrap" style="display:none">
        <div class="auth-field">
          <label>Full Name</label>
          <input type="text" id="signup-name" placeholder="Your name">
        </div>
        <div class="auth-field">
          <label>Email</label>
          <input type="email" id="signup-email" placeholder="you@email.com" autocomplete="email">
        </div>
        <div class="auth-field">
          <label>Password</label>
          <input type="password" id="signup-password" placeholder="Minimum 6 characters">
        </div>
        <div class="auth-error" id="signup-error"></div>
        <button class="auth-submit-btn" id="signup-submit-btn">Create Account</button>
      </div>

      <p class="auth-note">Your cart is saved as a guest. Login to place your order.</p>
    </div>
  `;
  return modal;
}

function bindAuthModalEvents() {
  // Tab switching
  document.querySelectorAll(".auth-tab").forEach(function(tab) {
    tab.addEventListener("click", function() {
      document.querySelectorAll(".auth-tab").forEach(function(t) { t.classList.remove("active"); });
      this.classList.add("active");
      var target = this.dataset.tab;
      document.getElementById("login-form-wrap").style.display  = target === "login"  ? "block" : "none";
      document.getElementById("signup-form-wrap").style.display = target === "signup" ? "block" : "none";
      document.getElementById("login-error").textContent  = "";
      document.getElementById("signup-error").textContent = "";
    });
  });

  // Close button
  document.getElementById("auth-close-btn").addEventListener("click", closeAuthModal);

  // Backdrop click
  document.getElementById("auth-modal").addEventListener("click", function(e) {
    if (e.target === this) closeAuthModal();
  });

  // LOGIN
  document.getElementById("login-submit-btn").addEventListener("click", function() {
    var email    = document.getElementById("login-email").value.trim();
    var password = document.getElementById("login-password").value;
    var errEl    = document.getElementById("login-error");
    errEl.textContent = "";

    if (!email || !password) { errEl.textContent = "Please fill all fields."; return; }

    firebase.auth().signInWithEmailAndPassword(email, password)
      .then(function(cred) {
        syncCartToFirestore(cred.user);
        closeAuthModal();
        var modal = document.getElementById("auth-modal");
        if (modal && modal._onSuccess) modal._onSuccess(cred.user);
      })
      .catch(function(err) {
        errEl.textContent = getFriendlyError(err.code);
      });
  });

  // SIGNUP
  document.getElementById("signup-submit-btn").addEventListener("click", function() {
    var name     = document.getElementById("signup-name").value.trim();
    var email    = document.getElementById("signup-email").value.trim();
    var password = document.getElementById("signup-password").value;
    var errEl    = document.getElementById("signup-error");
    errEl.textContent = "";

    if (!name || !email || !password) { errEl.textContent = "Please fill all fields."; return; }
    if (password.length < 6)          { errEl.textContent = "Password must be at least 6 characters."; return; }

    firebase.auth().createUserWithEmailAndPassword(email, password)
      .then(function(cred) {
        firebase.firestore().collection("users").doc(cred.user.uid).set({
          name: name,
          email: email,
          createdAt: new Date().toISOString()
        });
        syncCartToFirestore(cred.user);
        closeAuthModal();
        var modal = document.getElementById("auth-modal");
        if (modal && modal._onSuccess) modal._onSuccess(cred.user);
      })
      .catch(function(err) {
        errEl.textContent = getFriendlyError(err.code);
      });
  });
}

function syncCartToFirestore(user) {
  var localCart = JSON.parse(localStorage.getItem("es_cart") || "[]");
  if (localCart.length === 0) return;

  var cartRef = firebase.firestore().collection("carts").doc(user.uid);
  cartRef.get().then(function(doc) {
    var merged = localCart;
    if (doc.exists) {
      var existing = doc.data().items || [];
      existing.forEach(function(fi) {
        var local = merged.find(function(i) { return i.id === fi.id; });
        if (local) { local.qty += fi.qty; }
        else { merged.push(fi); }
      });
    }
    cartRef.set({ items: merged, updatedAt: new Date().toISOString(), userEmail: user.email });
  });
}

function getFriendlyError(code) {
  var map = {
    "auth/user-not-found":      "No account found with this email.",
    "auth/wrong-password":      "Incorrect password. Please try again.",
    "auth/email-already-in-use":"This email is already registered. Please login.",
    "auth/invalid-email":       "Please enter a valid email address.",
    "auth/weak-password":       "Password must be at least 6 characters.",
    "auth/too-many-requests":   "Too many attempts. Please try again later.",
    "auth/invalid-credential":  "Invalid email or password.",
  };
  return map[code] || "Something went wrong. Please try again.";
}

// Expose globally
window.openAuthModal  = openAuthModal;
window.closeAuthModal = closeAuthModal;
