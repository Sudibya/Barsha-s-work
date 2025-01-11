(function () {

	'use strict'


	AOS.init({
		duration: 800,
		easing: 'slide',
		once: true
	});

	var preloader = function() {

		var loader = document.querySelector('.loader');
		var overlay = document.getElementById('overlayer');

		function fadeOut(el) {
			el.style.opacity = 1;
			(function fade() {
				if ((el.style.opacity -= .1) < 0) {
					el.style.display = "none";
				} else {
					requestAnimationFrame(fade);
				}
			})();
		};

		setTimeout(function() {
			fadeOut(loader);
			fadeOut(overlay);
		}, 200);
	};
	preloader();
	

	var tinySdlier = function() {

		var heroSlider = document.querySelectorAll('.hero-slide');
		var propertySlider = document.querySelectorAll('.property-slider');
		var imgPropertySlider = document.querySelectorAll('.img-property-slide');
		var testimonialSlider = document.querySelectorAll('.testimonial-slider');
		

		if ( heroSlider.length > 0 ) {
			var tnsHeroSlider = tns({
				container: '.hero-slide',
				mode: 'carousel',
				speed: 700,
				autoplay: true,
				controls: false,
				nav: false,
				autoplayButtonOutput: false,
				controlsContainer: '#hero-nav',
			});
		}


		if ( imgPropertySlider.length > 0 ) {
			var tnsPropertyImageSlider = tns({
				container: '.img-property-slide',
				mode: 'carousel',
				speed: 700,
				items: 1,
				gutter: 30,
				autoplay: true,
				controls: false,
				nav: true,
				autoplayButtonOutput: false
			});
		}

		if ( propertySlider.length> 0 ) {
			var tnsSlider = tns({
				container: '.property-slider',
				mode: 'carousel',
				speed: 700,
				gutter: 30,
				items: 3,
				autoplay: true,
				autoplayButtonOutput: false,
				controlsContainer: '#property-nav',
				responsive: {
					0: {
						items: 1
					},
					700: {
						items: 2
					},
					900: {
						items: 3
					}
				}
			});
		}


		if ( testimonialSlider.length> 0 ) {
			var tnsSlider = tns({
				container: '.testimonial-slider',
				mode: 'carousel',
				speed: 700,
				items: 3,
				gutter: 50,
				autoplay: true,
				autoplayButtonOutput: false,
				controlsContainer: '#testimonial-nav',
				responsive: {
					0: {
						items: 1
					},
					700: {
						items: 2
					},
					900: {
						items: 3
					}
				}
			});
		}
	}
	tinySdlier();



})()


document.addEventListener("DOMContentLoaded", function () {
  const buyPropertyForm = document.getElementById("buyPropertyForm");
  const seeDetailsBtns = document.querySelectorAll(".see-details-btn");
  let redirectUrl = ""; // Variable to hold the redirect URL from "See Details" buttons

  // Capture the redirect URL from the "See Details" button when opening the modal
  seeDetailsBtns.forEach(button => {
    button.addEventListener("click", function () {
      // Set redirect URL from "See Details" button's data attribute
      redirectUrl = button.getAttribute("data-redirect-url") || "";
    });
  });

  // Form submission handling for both "Get Quote" and "See Details"
  buyPropertyForm.addEventListener("submit", function (event) {
    event.preventDefault();
    event.stopPropagation();

    if (buyPropertyForm.checkValidity()) {
      if (validateRecaptcha()) {
        if (redirectUrl) {
          // If redirect URL is set (from "See Details" button), redirect to that URL
          window.location.href = redirectUrl;
        } else {
          // Otherwise, handle "Get Quote" submission logic
          alert("Form submitted successfully!"); // Replace with actual email handling logic
        }
      } else {
        document.getElementById("recaptchaError").textContent = "Please complete the reCAPTCHA.";
      }
    }

    buyPropertyForm.classList.add("was-validated");
  });
});

function validateRecaptcha() {
  const response = grecaptcha.getResponse();
  return response.length > 0;
}

