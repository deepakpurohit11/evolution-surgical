document.addEventListener("DOMContentLoaded", function () {
    const exploreBtn = document.getElementById("explore-btn");
    const exploreSection = document.getElementById("explore-collections");
    const header = document.querySelector("header");

    if (exploreBtn && exploreSection && header) {
        exploreBtn.addEventListener("click", function () {

            const headerHeight = header.offsetHeight;
            const sectionPosition = exploreSection.getBoundingClientRect().top + window.pageYOffset;

            window.scrollTo({
                top: sectionPosition - headerHeight - 15, // small breathing space
                behavior: "smooth"
            });

        });
    }
});


const faqItems = document.querySelectorAll(".faq-item");

faqItems.forEach(item => {
  const question = item.querySelector(".faq-question");
  const answer = item.querySelector(".faq-answer");

  question.addEventListener("click", () => {

    const isOpen = answer.style.maxHeight && answer.style.maxHeight !== "0px";

    // Close all
    faqItems.forEach(i => {
      const a = i.querySelector(".faq-answer");
      a.style.maxHeight = null;
      a.style.padding = "0 20px";
    });

    // Open current if it was closed
    if (!isOpen) {
      answer.style.maxHeight = answer.scrollHeight + "px";
      answer.style.padding = "15px 20px 20px";
    }

  });
});


// FORM JAVASCRIPT

const scriptURL = "https://script.google.com/macros/s/AKfycbyoud1nG0y2NTxeJ264rFeGA8IBSvyFMhiuOOIChObgBaxryIhSRT6JIt_-k4yF9dPN/exec";

const form = document.getElementById("enquiry-form");

form.addEventListener("submit", e => {

  e.preventDefault();

  fetch(scriptURL, {
    method: "POST",
    body: new FormData(form)
  })
  .then(response => {

  const popup = document.getElementById("success-popup");
  popup.classList.add("show");

  setTimeout(() => {
    popup.classList.remove("show");
  }, 4000);

  form.reset();

})
})
  .catch(error => {
      document.getElementById("form-message").innerText =
      "Something went wrong. Please try again.";
  });









