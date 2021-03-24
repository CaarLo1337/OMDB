const burgerMenu = (x) => {
    x.classList.toggle("change");
    const navbar = document.getElementById('mobilenav');
    if (navbar.style.opacity === "1") {
        navbar.style.opacity = "0";
      } else {
        navbar.style.opacity = "1";
      }
  }

