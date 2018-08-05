var mainPageData;
var subPageData;
var mainPageDataRequest = new XMLHttpRequest();
var subPageDataRequest = new XMLHttpRequest();
var currentMainPage;
var currentSubPage;
var urlParameters;
  
loadMainPageNavbar();

function loadMainPageNavbar() {
  urlParameters = getUrlVars();
  
  currentMainPage = urlParameters["main_page"];
  currentSubPage = urlParameters["sub_page"];

  if (!currentMainPage)
    currentMainPage = "Home";

  mainPageDataRequest.open('GET', 'http://localhost/CMSAssignment/backend/main_page_api.php');
  mainPageDataRequest.onload = loadMainPages;
  mainPageDataRequest.send();
}

function loadMainPages(evt) {
  mainPageData = JSON.parse(mainPageDataRequest.responseText);

  var navbar = document.createElement('ul');

  var div = document.getElementById('main_pages');
  div.appendChild(navbar);

  var pageContent;

  mainPageData.forEach(element => {
    var li = document.createElement('li');

    var a = document.createElement('a');

    a.setAttribute('href', '/?main_page=' + element.name);

    var encodedPageName = encodeURI(element.name);

    if ((element.name === 'Home' && !urlParameters["main_page"]) || encodedPageName == urlParameters["main_page"]) {
      console.log("name found");
      a.setAttribute('class', 'active');
      pageContent = element.content;
    }

    a.innerText = element.name;

    li.appendChild(a);

    navbar.appendChild(li);
  });

  var admin_li = document.createElement('li');
  var admin_a = document.createElement('a');

  var adminClasses = 'adminButton';

  if(getSession()) {
    adminClasses += ' active';
  }

  admin_li.setAttribute('class', adminClasses);

  if (getSession()) {
    admin_a.setAttribute('href', '/');
    admin_a.onclick = function() {
      document.cookie += '; expires=Thu, 01 Jan 1970 00:00:01 GMT;';
    }
  } else {
    admin_a.setAttribute('href', '/admin');

  }

  admin_a.innerText = getSession() ? 'Logout' : 'Login';
  admin_li.appendChild(admin_a);

  navbar.appendChild(admin_li);

  if (!urlParameters['sub_page']) {
    var paragraphs = document.getElementById('content');
    var p = document.createElement('p');
    p.innerHTML = pageContent;

    if (getSession()) {
      p.contentEditable = 'true';
    }
  
    paragraphs.appendChild(p);
  }

  showFooter();
}

loadSubPageNavbar();

function loadSubPageNavbar() {
  subPageDataRequest.open('GET', 'http://localhost/CMSAssignment/backend/sub_page_api.php?mainpage_name=' + currentMainPage);
  subPageDataRequest.onload = loadSubPages;
  subPageDataRequest.send();
}

function loadSubPages(evt) {

  subPageData = JSON.parse(subPageDataRequest.responseText);

  var navbar = document.createElement('ul');

  var div = document.getElementById('sub_pages');
  div.appendChild(navbar);

  var pageData;

  subPageData.forEach(element => {
    var li = document.createElement('li');

    var a = document.createElement('a');
    
    a.setAttribute('href', '?main_page=' + currentMainPage + '&sub_page=' + element.name);

    if (urlParameters["sub_page"] == encodeURI(element.name)) {
      a.setAttribute('class', 'active');
      pageData = element.content;
    }
    
    a.innerText = element.name;

    li.appendChild(a);

    navbar.appendChild(li);
  });

  if (pageData) {
    var paragraphs = document.getElementById('content');
    var p = document.createElement('p');
    p.innerHTML = pageData;
  
    paragraphs.appendChild(p);
  }
}

function showFooter() {
  if(getSession()) {
    var footer = document.getElementById('footer');

    var navbar = document.createElement('ul');
    var save_li = document.createElement('li');
    var delete_li = document.createElement('li');
    var save_a = document.createElement('a');
    var delete_a = document.createElement('a');

    save_a.onclick = saveData;
    save_a.innerText = 'Save Content';

    delete_a.onclick = deletePage;
    delete_a.innerText = 'Delete Page';

    save_li.appendChild(save_a);
    delete_li.appendChild(delete_a);

    navbar.appendChild(save_li);
    navbar.appendChild(delete_li);

    footer.appendChild(navbar);
  }
}

function saveData(){
  console.log('Save');
}

function deletePage(){
  console.log('Delete');
  document.location = '/';
}

function getUrlVars() {
  var vars = {};
  var parts = window.location.href.replace(/[?&]+([^=&]+)=([^&]*)/gi, function(m,key,value) {
      vars[key] = value;
  });
  return vars;
}

function getSession() {
  return document.cookie.includes('token=') ? document.cookie.replace('token=', '') : false;
}