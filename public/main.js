const burgerMenu = (x) => {
    x.classList.toggle("change");
    const navbar = document.getElementById('mobilenav');
    if (navbar.style.display === "flex") {
        navbar.style.display = "none";
      } else {
        navbar.style.display = "flex";
      }
  }

