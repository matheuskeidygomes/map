let menuBtn = document.querySelector(".menu-image");
let closeBtn = document.querySelector(".close-menu");
let asideMenu = document.getElementById("aside-menu");

function toggleMenu() {
    if (asideMenu.style.display !== "flex") {               // If menu is hidden, then show it, otherwise hide it
        asideMenu.style.display = "flex";
        menuBtn.style.display = "none";
    } else {
        asideMenu.style.display = "none"
        menuBtn.style.display = "flex";
    }
}

menuBtn.addEventListener("click", toggleMenu);                          // Adding the event listener to the button        
closeBtn.addEventListener("click", toggleMenu);                         // Adding the event listener to the button