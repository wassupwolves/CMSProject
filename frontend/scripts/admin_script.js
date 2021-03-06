var data;
var request = new XMLHttpRequest();
var username;
var password;

function verifyLogin() {
  username = document.getElementById('username').value;
  password = document.getElementById('password').value;

  // LOCALHOST
  request.open('GET', 'http://10.10.16.205/cmsbackend/login_api.php?username=' + username + '&password=' + password);
  request.onload = isAdmin;
  request.send();
}

function isAdmin(evt) {
  var div = document.getElementById('div');  

  data = JSON.parse(request.responseText);

  console.log(data);
  
  data.forEach(element => {
    if(element.login === '0') {
      document.getElementById('username').value = '';
      document.getElementById('password').value = '';

      var p = document.createElement('p');
      p.innerText = 'Username and password are not valid';

      div.appendChild(p);
    } else {
      document.cookie = "token=" + element.token;
      document.location = '/?main_page=Home';
    }
  });

  // Store session token

  // Redirect to index(edit) page
}

function readStyle() {
  // LOCALHOST
  var url = 'http://10.10.16.205/cmsbackend/current_style.php';

  var request = new XMLHttpRequest();
  request.open('GET', url);
  request.send();
  request.onload = function(evt) {
    document.getElementById("currentStyle").innerHTML = request.response;
  }
  
}