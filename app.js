// wrap document ready function around my whole JS/jquery to wait for DOM to load
// just in case and good practice? can also short had as $(function() {});
$(document).ready(() => {
  // using an event listener on click, toggle class between far and fas
  // come back to this event listener for the bonus
  // Is this recommended? creating a function for this purpose to make smaller digestable code?
  populateStories();
  addStory();
  favoriteStar();
  //showFavorite();
  userSignUp();
  logIn();
  profile();
  showAll();
  unFavorite();

  function favoriteStar() {
    // trying event delegation
    // instead of assigning event listener to EVERY star
    // do it to only the parent and add a second selector parameter to listen
    $('.stories-list').on('click', 'i', function(event) {
      let favList = $('fav-list');
      let username = localStorage.getItem('username');
      let userToken = localStorage.getItem('token');
      $(this).toggleClass('far fas');
      //send ajax request to post data
      $.ajax({
        method: 'post',
        url: `https://hack-or-snooze.herokuapp.com/users/${username}/favorites/${
          event.target.id
        }`,
        headers: { Authorization: `Bearer ${userToken}` }
      }).then(function(response) {
        console.log(response);
      });
    });
  }
  function unFavorite() {
    $('.remove-fav').on('click', function(event) {
      //let favList = $('fav-list');
      let username = localStorage.getItem('username');
      let userToken = localStorage.getItem('token');
      //$(this).toggleClass('far fas');
      //send ajax request to post data
      $.ajax({
        method: 'DELETE',
        url: `https://hack-or-snooze.herokuapp.com/users/${username}/favorites/${
          event.target.id
        }`,
        headers: { Authorization: `Bearer ${userToken}` }
      }).then(function(response) {
        console.log(response);
      });
    });
  }

  function addStory() {
    $('#submit-form').submit(function(event) {
      event.preventDefault();
      let urlVal = $('#url').val();
      let titleVal = $('#title').val();
      let authorVal = $('#author').val();
      let username = localStorage.getItem('username');
      let userToken = localStorage.getItem('token');

      $('.stories-list').append(
        `<li class="story"><i class="far fa-star"></i> <a href="${urlVal}">${titleVal}</a></li>`
      );
      // ajax to API
      $.ajax({
        method: 'POST',
        url: 'https://hack-or-snooze.herokuapp.com/stories',
        data: {
          data: {
            author: authorVal,
            title: titleVal,
            url: urlVal,
            username: username
          }
        },
        headers: { Authorization: `Bearer ${userToken}` }
      }).then(function(response) {
        console.log(response);
      });

      event.target.reset();
    });
  }
  // write a function to hide current list and show favorite list
  // function showFavorite() {
  //   let favoriteNav = $('.favoriteNav');
  //   let navItems = $('#navbarNavAltMarkup');
  //   let allStories = $('.all-stories');
  //   let favStories = $('.fav-list');
  //   // when you click the favorite text on the nav bar do certain steps
  //   // hide current content
  //   // display new ordered list
  //   // event delegation to add event listener to the favortie nav button
  //   navItems.on('click', '.favoriteNav', function(event) {
  //     // hide only non faves? far is the class of nonfave story
  //     $('.far')
  //       // closest will find the closest parent that meets the condition?
  //       // so will find li name and hide it that also has class of .far
  //       .closest('li')
  //       .toggleClass('all')
  //       .hide();
  //     // changing text to toggle between fav and all
  //     // also switch class will only work for jquery UI?
  //     // need to remove class and then add a class or would toggle class work better?
  //     $(this).text($(this).text() === 'Favorites' ? 'All' : 'Favorites');
  //     $(this)
  //       .removeClass('favoriteNav')
  //       .addClass('allNav');
  //   });
  // }
  // show all function
  // use .allNav class that was added to the navbar and also use event delegation
  function showAll() {
    let navItems = $('#navbarNavAltMarkup');

    navItems.on('click', '.allNav', function(event) {
      $('.far')
        .closest('li')
        .show();
      $(this).text($(this).text() === 'All' ? 'Favorites' : 'All');
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
  function populateStories() {
    $.getJSON('https://hack-or-snooze.herokuapp.com/stories/')
      .then(function(response) {
        for (let i = 0; i < 10; i++) {
          var storyid = response.data[i].storyId;
          let urlVal = response.data[i].url;
          let storyVal = response.data[i].title;
          $('.stories-list').append(
            `<li class="story"><i class="far fa-star" id ="${storyid}"></i> <a href="${urlVal}">${storyVal}</a></li>`
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
  }

  $('#loginlink').on('click', function(event) {
    //alert('hello');
    $('#login-form').toggleClass(' hidden show');
  });
  // 2) create a user sign up
  function userSignUp() {
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
    });
  }
  // 3) log in
  function logIn(event) {
    $('#login-form').submit(function(event) {
      event.preventDefault();
      let userName = $('#loginusername').val();
      let password = $('#loginpassword').val();
      localStorage.setItem('username', userName);
      $.post('https://hack-or-snooze.herokuapp.com/auth', {
        data: {
          username: userName,
          password: password
        }
      }).then(function(response) {
        localStorage.setItem('token', response.data.token);
        $('#logoutLink').toggleClass('hidden show');
        $('#loginlink').toggleClass(' show hidden');
        $('#signUpLink').toggleClass('show hidden');
        $('#submitlink').toggleClass('show hidden');
        $('#profile').toggleClass('hidden show');
      });
      event.target.reset();
    });
  }
  //6 login profile
  function profile() {
    $('#profile').on('click', function(event) {
      $('#profile-name').empty();
      $('#profile-username').empty();
      $('#showfavorite').empty();
      $('#mystories').empty();
      let username = localStorage.getItem('username');
      let userToken = localStorage.getItem('token');

      $.ajax({
        method: 'GET',
        url: `https://hack-or-snooze.herokuapp.com/users/${username}`,
        headers: { Authorization: `Bearer ${userToken}` },
        dataType: 'json'
      }).then(function(response) {
        let favlength = response.data.favorites.length;
        let storiesLength = response.data.stories.length;
        let profileUsername = response.data.username;
        let profileName = response.data.name;
        $('#profile-name').append(`Name: ${profileName}`);
        $('#profile-username').append(`Username: ${profileUsername}`);
        $('.profile').toggleClass('show hidden');
        // add favorites
        for (let i = 0; i < favlength; i++) {
          let url = response.data.favorites[i].url;
          let title = response.data.favorites[i].title;
          let favId = response.data.favorites[i].storyId;
          $('#showfavorite').append(
            `<li class="story"><i class="fas fa-star"><a href="${url}">${title}</a><button class='remove-fav' type='button'>Remove Favorite</button></li>`
          );
        }
        //add stories
        for (let j = 0; j < storiesLength; j++) {
          let url = response.data.stories[j].url;
          let title = response.data.stories[j].title;
          let storyId = response.data.stories[j].storyId;
          $('#mystories').append(
            `<li class="story"><a href="${url}">${title}</a></li>`
          );
        }
      });
    });
  }

  //7.show favourite
  //   function showFavorite(){
  // $.ajax({
  //   method:"GET",
  //   url:
  // })
  // }

  //show submit div on click of  submit link
  $('#submitlink').on('click', function(event) {
    $('#submit-form').toggleClass('hidden show');
  });
});
