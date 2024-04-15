//navbar sizechange on scroll
document.addEventListener('scroll', function() {
    var navbar = document.querySelector('.navbar');
    if (window.scrollY > 10) { // Adjust the scroll threshold as needed
      navbar.classList.add('small');
    } else {
      navbar.classList.remove('small');
    }
  });