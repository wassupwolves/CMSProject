var mainPageData;
var subPageData;
var mainPageDataRequest = new XMLHttpRequest();
var subPageDataRequest = new XMLHttpRequest();
  
loadMainPageNavbar();
loadSubPageNavbar();

function loadMainPageNavbar() {
  mainPageDataRequest.open('GET', 'http://localhost/CMSAssignment/backend/main_page_api.php');
  mainPageDataRequest.onload = loadMainPages;
  mainPageDataRequest.send();
}

function loadSubPageNavbar() {
  subPageDataRequest.open('GET', 'http://localhost/CMSAssignment/backend/sub_page_api.php?mainpage_name=about');
  subPageDataRequest.onload = loadSubPages;
  subPageDataRequest.send();
}

function loadMainPages(evt) {
  mainPageData = JSON.parse(mainPageDataRequest.responseText);
  console.log(mainPageData);

  var navbar = document.createElement('ul');

  var div = document.getElementById('main_pages');
  div.appendChild(navbar);

  mainPageData.forEach(element => {
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

function loadSubPages(evt) {
  subPageData = JSON.parse(subPageDataRequest.responseText);
  console.log(subPageData);

  var navbar = document.createElement('ul');

  var div = document.getElementById('sub_pages');
  div.appendChild(navbar);

  subPageData.forEach(element => {
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