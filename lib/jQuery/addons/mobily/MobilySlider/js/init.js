$(function(){
	
	$('.slider').mobilyslider({
		content: '.sliderContent',
		children: 'div',
		orientation: 'horizontal',
		animationSpeed: 300,
		autoplay: false,
		autoplaySpeed: 3000,
		pauseOnHover: false,
		bullets: true,
		arrows: true,
		prev: 'prev',
		next: 'next',
		animationStart: function(){},
		animationComplete: function(){}
	});
	
});
