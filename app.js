// wrap document ready function around my whole JS/jquery to wait for DOM to load
// just in case and good practice? can also short had as $(function() {});
$(document).ready(() => {
  // using an event listener on click, toggle class between far and fas
  // come back to this event listener for the bonus
  // Is this recommended? creating a function for this purpose to make smaller digestable code?
  function favoriteStar() {
    // trying event delegation
    // instead of assigning event listener to EVERY star
    // do it to only the parent and add a second selector parameter to listen
    $('.stories-list').on('click', 'i', function(event) {
      let favList = $('fav-list');
      //let star = event.target
      $(this).toggleClass('far fas');
      // need to append to favorite list when it is clicked
      // how to get the information we want?
      //favList.append(`<li class="story"><i class="far fa-star"></i> <a href="${dataVal}">${storyVal}</a></li>`)
    });
  } // can I write IIFE here?
  // function that will prevent default when you click the submit btn in the form
  // and instead add a li element to the ordered list
  // will need to grab values from form
  function addStory(event) {
    // click is a jQuery for another way of saying on click or evenlistener for click
    //
    $('#submit-form').submit(function(event) {
      event.preventDefault();
      let storyVal = $('#story').val();
      let dataVal = $('#data').val();
      // adding story and link to list
      // will need to use href to link text
      $('.stories-list').append(
        `<li class="story"><i class="far fa-star"></i> <a href="${dataVal}">${storyVal}</a></li>`
      );
      // fix favorite star later, right now it is only adding event listener to new and toggling off the listener
      // for previous stories
      //favoriteStar();
      // clarify why this works
      // reset form to blank
      $('#submit-form').each(function() {
        this.reset();
      });
    });
  }
  // write a function to hide current list and show favorite list
  function showFavorite() {
    let favoriteNav = $('.favoriteNav');
    let navItems = $('#navbarNavAltMarkup');
    let allStories = $('.all-stories');
    let favStories = $('.fav-list');
    // when you click the favorite text on the nav bar do certain steps
    // hide current content
    // display new ordered list
    // event delegation to add event listener to the favortie nav button
    navItems.on('click', '.favoriteNav', function(event) {
      // hide only non faves? far is the class of nonfave story
      $('.far')
        // closest will find the closest parent that meets the condition?
        // so will find li name and hide it that also has class of .far
        .closest('li')
        .toggleClass('all')
        .hide();
      // changing text to toggle between fav and all
      // also switch class will only work for jquery UI?
      // need to remove class and then add a class or would toggle class work better?
      $(this).text($(this).text() === '| Favorites' ? '| All' : '| Favorites');
      $(this)
        .removeClass('favoriteNav')
        .addClass('allNav');
    });
  }
  // show all function
  // use .allNav class that was added to the navbar and also use event delegation
  function showAll() {
    let navItems = $('#navbarNavAltMarkup');

    navItems.on('click', '.allNav', function(event) {
      $('.far')
        .closest('li')
        .show();
      $(this).text($(this).text() === '| All' ? '| Favorites' : '| All');
      $(this)
        .removeClass('allNav')
        .addClass('favoriteNav');
    });
  }
  // i want to say that if the id of switch has a class of allNav then add eventlistener on click to show all
  // and toggle classes again
  if ($('#switch.allNav')) {
    showAll();
  }
  // 1) grabbing 10 latest stories
  $.getJSON('https://hack-or-snooze.herokuapp.com/stories/')
    .then(function(response) {
      for (let i = 0; i < 10; i++) {
        let urlVal = response.data[i].url;
        let storyVal = response.data[i].title;
        $('.stories-list').append(
          `<li class="story"><i class="far fa-star"></i> <a href="${urlVal}">${storyVal}</a></li>`
        );
      }
    })
    .catch(function(err) {
      console.log(err);
    });
  // Make signUp form
  $('#signUpLink').on('click', function(event) {
    $('#signup-form').toggleClass(' hidden show');
  });

  $('#loginlink').on('click', function(event) {
    //alert('hello');
    $('#login-form').toggleClass(' hidden show');
  });
  // 2) create a user sign up
  function userSignUp(event) {
    // click is a jQuery for another way of saying on click or evenlistener for click
    //
    $('#signup-form').submit(function(event) {
      event.preventDefault();
      let fullName = $('#full-name').val();
      let userName = $('#user-name').val();
      let password = $('#password').val();
      $.post('https://hack-or-snooze.herokuapp.com/users', {
        data: {
          name: fullName,
          username: userName,
          password: password
        }
      }).then(function(response) {
        console.log('you have made a new user');
        console.log(response);
        console.log(response.data);
      });
      event.target.reset();
      // $('#signup-form').each(function() {
      //   this.reset();
      // });
    });
  }
  // 3) log in
  function logIn(event) {
    $('#login-form').submit(function(event) {
      event.preventDefault();
      let userName = $('#loginusername').val();
      let password = $('#loginpassword').val();
      $.post('https://hack-or-snooze.herokuapp.com/auth', {
        data: {
          username: userName,
          password: password
        }
      }).then(function(response) {
        localStorage.setItem('token', response.data.token);
        console.log(localStorage.getItem('token'));
        $('#logoutLink').toggleClass('hidden show');
        $('#loginlink').toggleClass(' show hidden');
        $('#signUpLink').toggleClass('show hidden');
        $('#submitlink').toggleClass('show hidden');
      });
      event.target.reset();
    });
  }

  //show submit div on click of  submit link
  $('#submitlink').on('click', function(event) {
    $('#submit-form').toggleClass('hidden show');
  });

  addStory();
  favoriteStar();
  showFavorite();
  userSignUp();
  logIn();
  //showAll();
});
