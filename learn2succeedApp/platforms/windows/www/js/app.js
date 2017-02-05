$(document).ready(function () {
  $('select').material_select();

  $('.button-collapse').sideNav({
    menuWidth: 300, // Default is 240
    edge: 'left', // Choose the horizontal origin
    closeOnClick: true, // Closes side-nav on <a> clicks, useful for Angular/Meteor
    draggable: true // Choose whether you can drag to open on touch screens
  });
});

var slider = document.getElementById('set_duration');
noUiSlider.create(slider, {
  start: [20, 80],
  connect: true,
  step: 1,
  range: {
    'min': 0,
    'max': 100
  },
  format: wNumb({
    decimals: 0
  })
});