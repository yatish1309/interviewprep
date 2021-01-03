var htab = $('#home-tab');
var h = $('#home');
var ptab = $('#profile-tab');
var p = $('#profile');


htab.click(()=>{
  $('a').removeClass("nav-link active");
  $('#home-tab').addClass("nav-link active");
  $('#profile-tab').addClass("nav-link");
  $('.tab-content div').removeClass("tab-pane fade show active");
  h.addClass("tab-pane fade show active");
  $('#profile').addClass("tab-pane fade");
});

ptab.click(()=>{
  console.log("hello");
  $('a').removeClass("nav-link active");
  $('#profile-tab').addClass("nav-link active");
  $('#home-tab').addClass("nav-link");
  $('.tab-content div').removeClass("tab-pane fade show active");
  $('#profile').addClass("tab-pane fade show active");
  $('#home').addClass("tab-pane fade");

});