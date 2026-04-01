
// SMOOTH SCROLL for Explore button
document.addEventListener("DOMContentLoaded", function () {
    var exploreBtn = document.getElementById("explore-btn");
    var exploreSection = document.getElementById("explore-collections");
    var header = document.querySelector("header");

    if (exploreBtn && exploreSection && header) {
        exploreBtn.addEventListener("click", function () {
            var headerHeight = header.offsetHeight;
            var sectionPosition = exploreSection.getBoundingClientRect().top + window.pageYOffset;
            window.scrollTo({
                top: sectionPosition - headerHeight - 15,
                behavior: "smooth"
            });
        });
    }
});


// FAQ ACCORDION
// Wrapped in DOMContentLoaded so it doesn't crash on pages without FAQs
document.addEventListener("DOMContentLoaded", function () {
    var faqItems = document.querySelectorAll(".faq-item");

    faqItems.forEach(function(item) {
        var question = item.querySelector(".faq-question");
        var answer   = item.querySelector(".faq-answer");
        if (!question || !answer) return;

        question.addEventListener("click", function() {
            var isOpen = item.classList.contains("open");

            // Close all
            faqItems.forEach(function(i) {
                i.classList.remove("open");
                var a = i.querySelector(".faq-answer");
                if (a) {
                    a.style.maxHeight = "0px";
                    a.style.padding   = "0 20px";
                }
            });

            // Open current if it was closed
            if (!isOpen) {
                item.classList.add("open");
                answer.style.maxHeight = answer.scrollHeight + 40 + "px";
                answer.style.padding   = "15px 20px 20px";
            }
        });
    });
});


// ENQUIRY FORM — only runs if form exists on page
document.addEventListener("DOMContentLoaded", function () {
    var form = document.getElementById("enquiry-form");
    if (!form) return; // EXIT if no form on this page

    var scriptURL = "https://script.google.com/macros/s/AKfycbwQKy9FSssFKP68C5ClcgfEl4JpleHoAggAUi1tx2ji5obas0w13jcjdizyvNJ_r5L-/exec";

    form.addEventListener("submit", function(e) {
        e.preventDefault();

        fetch(scriptURL, {
            method: "POST",
            body: new FormData(form)
        })
        .then(function(response) {
            var popup = document.getElementById("success-popup");
            if (popup) {
                popup.classList.add("show");
                setTimeout(function() { popup.classList.remove("show"); }, 4000);
            }
            form.reset();
        })
        .catch(function(error) {
            console.error("Form error:", error);
        });
    });
});


// STOP cart/amazon btn clicks from bubbling to card link
document.addEventListener("DOMContentLoaded", function () {
    document.querySelectorAll(".cart-btn, .amazon-btn").forEach(function(btn) {
        btn.addEventListener("click", function(e) {
            e.stopPropagation();
        });
    });
});


// SEARCH — called by loader.js after header is injected
function initSearch() {
    var searchIcon  = document.getElementById("search-icon");
    var overlay     = document.getElementById("search-overlay");
    var searchInput = document.getElementById("search-input");

    if (!searchIcon || !overlay || !searchInput) return;

    searchIcon.addEventListener("click", function() {
        overlay.style.display = "flex";
        searchInput.focus();
    });

    overlay.addEventListener("click", function(e) {
        if (e.target === overlay) overlay.style.display = "none";
    });

    var resultsBox = document.getElementById("search-results");

    var products = [
        { name: "Wrist Hand Support",          desc: "Static stabilizer for wrist sprains",    img: "images/splint_1.jpg", link: "wrist-support.html" },
        { name: "Functional Cock Up Splint",    desc: "Ergonomic wrist support",                img: "images/splint_2.png", link: "cockup-splint.html" },
        { name: "Pro Static Wrist Splint",      desc: "High immobilization wrist brace",        img: "images/splint_3.png", link: "pro-static-wrist-splint.html" },
        { name: "Adjustable Rigid Wrist Brace", desc: "Customizable wrist rigidity support",    img: "images/splint_4.png", link: "adjustable-rigid-wrist-brace.html" },
        { name: "Mallet Finger Splint",         desc: "Lightweight aluminium finger support",   img: "images/splint_5.jpg", link: "mallet-finger-splint.html" },
        { name: "Molded Mallet Finger Support", desc: "Ergonomic molded finger support",        img: "images/splint_6.jpg", link: "molded-mallet-finger-support.html" },
        { name: "Universal Mallet Splint",      desc: "Multi size finger splint",               img: "images/splint_7.jpg", link: "universal-mallet-splint.html" },
        { name: "Rubber Abdominal Belt",        desc: "Support belt for tummy reduction",       img: "images/waist1.png",   link: "rubbber-abdominal-belt.html" },
        { name: "Post Delivery Abdominal Belt", desc: "Comfortable post pregnancy belt",        img: "images/waist2.png",   link: "post-delivery-abdominal-belt.html" },
        { name: "Lumbo Sacral Back Support",    desc: "Breathable lower back support",          img: "images/waist3.png",   link: "lumbo-sacral-back-support.html" }
    ];

    searchInput.addEventListener("input", function() {
        var value = this.value.toLowerCase().trim();
        resultsBox.innerHTML = "";

        if (value === "") { resultsBox.style.display = "none"; return; }

        var filtered = products.filter(function(p) {
            return p.name.toLowerCase().includes(value);
        });

        filtered.forEach(function(product) {
            var div = document.createElement("div");
            div.classList.add("search-item");
            div.innerHTML =
                '<div class="search-product">' +
                    '<img src="' + product.img + '">' +
                    '<div class="search-info">' +
                        '<h4>' + product.name + '</h4>' +
                        '<p>' + product.desc + '</p>' +
                    '</div>' +
                '</div>';
            div.onclick = function() { window.location.href = product.link; };
            resultsBox.appendChild(div);
        });

        resultsBox.style.display = filtered.length ? "block" : "none";
    });
}


// HAMBURGER MENU — uses event delegation, works on every page
document.addEventListener("click", function(e) {
    var btn  = document.getElementById("hamburger-btn");
    var menu = document.getElementById("mobile-menu");

    if (!btn || !menu) return;

    if (btn.contains(e.target)) {
        btn.classList.toggle("open");
        menu.classList.toggle("open");
    } else if (!menu.contains(e.target)) {
        btn.classList.remove("open");
        menu.classList.remove("open");
    }
});
