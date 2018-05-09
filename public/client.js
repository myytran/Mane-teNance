$( document ).ready(function() {



  $('.wm-btn, .men-btn').click(function(display){
    $("ul").toggle();
      });

  $('ul.wm-services li, ul.men-services li').on('click', function() {
    $('#cart').show();
      $(this).appendTo($(`#cart`));
      });








});//end of doc ready
