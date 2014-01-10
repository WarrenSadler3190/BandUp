/* global document, window, io */

$(document).ready(initialize);

var socket,user,calendar;

function initialize(){

  // Create Date Variable for FullCalendar

  var date = new Date();
  var d = date.getDate();
  var m = date.getMonth();
  var y = date.getFullYear();

  // End Date Declaration

  $(document).foundation();
  initializeSocketIO();

  // Click Handlers Initialize
  $('#eventSubmit').on('click',clickAddEvent);
  $('#eventDelete').on('click',clickDeleteEvent);



  // End Click Handlers Initialize
  // *************************************
  // FullCalendar Initialize
  
  calendar = $('.calendar').fullCalendar({
    sayHello: function(){
      alert(Hello);
    },
    header: {
        left: 'prev, next today',
        center: 'title',
        right: 'month,basicWeek,basicDay'
      },
     events: {
        url: '/getEvents',
        type: 'GET',
        error: function() {
            alert('there was an error while fetching events!');
        }
      }
    });

  // End FullCalendar Initialize
  // *************************************
  // Date Selector Initialize

  var $fp = $( '.fpPicker' );
  $fp.filthypillow({
    minDateTime: function( ) {
      return moment( ); //now
    };
  });

  $fp.on( "focus", function( ) {
    $fp.filthypillow( "show" );
  });

  $fp.on( "fp:save", function( e, dateObj ) {
    $fp.val( dateObj.format( "MMM DD YYYY hh:mm A" ) );
    $fp.filthypillow( "hide" );
  });

  var $fp2 = $( ".second" );
  $fp2.filthypillow( { 
  minDateTime: function( ) {
    return moment( ); //now
  } 
  });

  $fp2.on( "focus", function() {
    $fp2.filthypillow( "show" );
  });

  $fp2.on( "fp:save", function( e, dateObj ) {
    $fp2.val( dateObj.format( "MMM DD YYYY hh:mm A" ) );
    $fp2.filthypillow( "hide" );
  });         

  // End Date Selector Initialize

}

// Click Handlers Response


function clickAddEvent(e){
  e.preventDefault();
  var newEvent = {};
  
  newEvent.title = $("#title").val();
  newEvent.color = $("#color").val();
  newEvent.start = $("#start").val();
  newEvent.user = sessionStorage.user;
  newEvent.end = $("#end").val();
  socket.emit('addEvent', {data:newEvent});
}

function clickDeleteEvent(e){
  e.preventDefault();
  var eventId = $(this).parent().data('id');
  socket.emit('deleteEvent',{eventId:eventId});
  $(this).parent().delete();
}

// End Click Handlers Response


function initializeSocketIO(){
  var port = window.location.port ? window.location.port : '80';
  var url = window.location.protocol + '//' + window.location.hostname + ':' + port + '/app';

  socket = io.connect(url);
  socket.on('connected', socketConnected);
  socket.on('eventSaved', socketRecievedNewEvent);
  socket.on('eventDeleted', sockectRecievedDeletedEvent);
}

function socketRecievedNewEvent(data){
  console.log(data);
  calendar.fullCalendar('renderEvent',
  {
    title: data.data.title,
    start: data.data.start,
    end: data.data.end,
    color: data.data.color
  },
    true
  );
  htmlAddEvent(data);
}




function socketConnected(data){
  console.log(data);
};


function htmlAddEvent(data){
  var event = '<li class="'+'event'+'"><div><h3>Event Title: <a href= "' + data.data._id + '">'+data.data.title+'</a></h3><p>Start Time: '+data.data.start+'</p><p>End Time: '+data.data.end+'</p><a class="'+ 'delete button alert' +'", href="'+data.data._id+'">x</a></div></li>';
  $('#eventList').prepend(event);
}