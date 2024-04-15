// hbackground image moement
//code from chatgpt
document.addEventListener('mousemove', parallax);

function parallax(e) {
  // Get the width and height of the module
  const moduleWidth = document.getElementById('module').offsetWidth;
  const moduleHeight = document.getElementById('module').offsetHeight;

  // Calculate the percentage of mouse position within the module
  const mouseXPercent = (e.clientX / moduleWidth) * 3;
  const mouseYPercent = (e.clientY / moduleHeight) * 3;

  // Update the background position based on mouse position
  const backgroundPositionX = 50 - (mouseXPercent / 2);
  const backgroundPositionY = 50 - (mouseYPercent / 2);

  document.getElementById('module').style.backgroundPosition = `${backgroundPositionX}% ${backgroundPositionY}%`;
}


//navbar sizechange on scroll
document.addEventListener('scroll', function() {
    var navbar = document.querySelector('.navbar');
    if (window.scrollY > 10) { // Adjust the scroll threshold as needed
      navbar.classList.add('small');
    } else {
      navbar.classList.remove('small');
    }
  });
  