var data;
var request = new XMLHttpRequest();

loadData();

function loadData() {
  request.open('GET', 'http://localhost/CMSAssignment/backend/main_page_api.php');
  request.onload = loadComplete;
  request.send();
}

function loadComplete(evt) {
  data = JSON.parse(request.responseText);
  console.log(data);

  var navbar = document.createElement('ul');

  var div = document.getElementById('main_pages');
  div.appendChild(navbar);

  data.forEach(element => {
    console.log(element);
    var li = document.createElement('li');

    var a = document.createElement('a');
    if(element.name === 'Home') {
      a.setAttribute('href', 'index');
    } else {
      a.setAttribute('href', element.name);
    }
    
    a.innerText = element.name;

    li.appendChild(a);

    navbar.appendChild(li);

    var paragraphs = document.createElement('div');
    paragraphs.innerHTML = element.content;

    div.appendChild(paragraphs);
  });

  console.log(document.location.pathname);
}