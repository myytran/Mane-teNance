$( document ).ready(function() {

  var time = 0;

  $('.wm-btn, .men-btn').click(function(e){ //toggles service menus
         $(this).siblings("div").children("ul").toggle();
   });

  $('ul.wm-services, ul.men-services').on('click', 'li', function() { //show cart when li is selected
    shows cart('#cart').show();
    $('#confirm-btn').show();//shows confirm button w/ endpoint to /Schedule
    $('#timeSum').show(); //shows time total for services
    $('#cartTimeBtn').show();
    $(this).clone().appendTo($(`.cart`)).append('<i class="glyphicon glyphicon-remove"></i>');

    time += $(this).data('time');

//clear out cart if Time = 0
  //  if(time) = 0){
  //   $('#timeSum').val([]);
    //} else {
    //  alert('You must select a service to proceed!');
    //}
    serviceTime(time);
    deleteService();







});


//functions
function deleteService(){
  $('.cart').off().on('click','i.glyphicon-remove',function(e) {
    var serviceTime= parseInt($(this).parent().attr('data-time'));
    $(this).parent().remove();
    getNewTime(serviceTime); //calls function to update new time
      });
}
function serviceTime(totalTime){
  $('#timeSum').html(' Total Time: <span>'+ totalTime + '</span> minutes ');
  $('input[type="hidden"]').val(totalTime);
};

function getNewTime(serviceTime) {
time = time - serviceTime;
$("#timeSum span").text(time);
$('input[type="hidden"]').val(time);

}

  }); //end of doc ready
