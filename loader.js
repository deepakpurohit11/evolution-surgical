fetch("header.html")
  .then(res => res.text())
  .then(data => {
    document.getElementById("header-container").innerHTML = data;

    // Wait a moment so DOM updates
    // setTimeout(() => {
      // initSearch();
    // }, 50);
  // });

  setTimeout(() => {
  initSearch();

  if (typeof initHeaderAuth === "function") {
    initHeaderAuth();
  }

}, 100);
});