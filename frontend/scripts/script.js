var mainPageData;
var subPageData;
var mainPageDataRequest = new XMLHttpRequest();
var subPageDataRequest = new XMLHttpRequest();
var currentMainPage;
var currentSubPage;
var urlParameters;
var canDeletePage;
  
showFooter();
loadMainPageNavbar();

function loadMainPageNavbar() {
  urlParameters = getUrlVars();
  
  currentMainPage = urlParameters["main_page"];
  currentSubPage = urlParameters["sub_page"];

  if (!currentMainPage)
    currentMainPage = "Home";

  // LOCALHOST
  mainPageDataRequest.open('GET', 'http://10.10.16.205/cmsbackend/main_page_api.php');
  mainPageDataRequest.onload = loadMainPages;
  mainPageDataRequest.send();
}

function loadMainPages(evt) {
  mainPageData = JSON.parse(mainPageDataRequest.responseText);
  canDeletePage = false;

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
      a.setAttribute('class', 'active');
      pageContent = element.content;

      if(element.can_delete === '1' && !urlParameters["sub_page"]){
        canDeletePage = true;
      }
    }

    a.innerText = element.name;

    li.appendChild(a);

    navbar.appendChild(li);
  });

  makeCreatePageElement(navbar, true);

  var admin_li = document.createElement('li');
  var admin_a = document.createElement('a');

  var adminClasses = 'adminButton';

  if(getSession()) {
    adminClasses += ' active';
  }

  admin_li.setAttribute('class', adminClasses);

  if (getSession()) {
    admin_a.setAttribute('href', '/?main_page=Home');
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
    p.setAttribute('id', 'cmsContent');

    if (getSession()) {
      p.contentEditable = 'true';
    }
  
    paragraphs.appendChild(p);
  }

  appendFooter();
}

loadSubPageNavbar();

function loadSubPageNavbar() {
  // LOCALHOST
  subPageDataRequest.open('GET', 'http://10.10.16.205/cmsbackend/sub_page_api.php?mainpage_name=' + currentMainPage);
  subPageDataRequest.onload = loadSubPages;
  subPageDataRequest.send();
}

function loadSubPages(evt) {
  subPageData = JSON.parse(subPageDataRequest.responseText);
  canDeletePage = false;

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

      if(element.can_delete === '1' ){
        canDeletePage = true;
      }
    }
    
    a.innerText = element.name;

    li.appendChild(a);

    navbar.appendChild(li);
  });

  makeCreatePageElement(navbar, false);

  if (pageData) {
    var paragraphs = document.getElementById('content');
    var p = document.createElement('p');
    p.innerHTML = pageData;
    if (getSession()) {
      p.contentEditable = 'true';
    }
    p.setAttribute('id', 'cmsContent');
  
    paragraphs.appendChild(p);
  }

  appendFooter();
}

function showFooter() {
  if(getSession()) {
    var footer = document.getElementById('footer');

    var navbar = document.createElement('ul');
    navbar.setAttribute('id', 'footernav');

    var save_li = document.createElement('li');
    var save_a = document.createElement('a');

    save_a.onclick = saveData;
    save_a.innerText = 'Save Content';
    save_li.appendChild(save_a);

    var styleChooserContainer = document.createElement('li');
    var styleChooserButton = document.createElement('button');
    var dropdownHolder = document.createElement('div');
    var style1 = document.createElement('a');
    var style2 = document.createElement('a');
    var style3 = document.createElement('a');

    styleChooserContainer.setAttribute('class', 'dropup');
    styleChooserButton.setAttribute('class', 'dropbtn');
    dropdownHolder.setAttribute('class', 'dropup-content');
    style1.addEventListener("click", function() { updateStyle(1); });
    style2.addEventListener("click", function() { updateStyle(2); });
    style3.addEventListener("click", function() { updateStyle(3); });

    styleChooserButton.innerText = 'Styles';
    style1.innerText = 'House';
    style2.innerText = 'Tropical Punch';
    style3.innerText = "Clickbeatty";

    dropdownHolder.appendChild(style1);
    dropdownHolder.appendChild(style2);
    dropdownHolder.appendChild(style3);
    styleChooserContainer.appendChild(styleChooserButton);
    styleChooserContainer.appendChild(dropdownHolder);

    navbar.appendChild(save_li);
    navbar.appendChild(styleChooserContainer);    

    footer.appendChild(navbar);
  }
}

function appendFooter(){
  if(getSession()){
    if(canDeletePage) {
      var footer = document.getElementById('footernav');
  
      var delete_li = document.createElement('li');
      var delete_a = document.createElement('a');
  
      delete_a.onclick = deletePage;
      delete_a.innerText = 'Yeet Page';    
      delete_li.appendChild(delete_a);    
      footer.appendChild(delete_li);
    }
  }
}

function saveData(){
  console.log("Save");

  if (!getSession())
    return;

  var isSubPage = urlParameters["sub_page"];
  var pageName = urlParameters[isSubPage ? "sub_page" : "main_page"];
  // LOCALHOST
  var url = 'http://10.10.16.205/cmsbackend/edit_page.php?token=' + getSession() + '&isSubPage=' + (isSubPage ? true : false) + '&pageName=' + pageName;
  var request = new XMLHttpRequest();
  var payload = document.getElementById('cmsContent').innerHTML;
  request.open('POST', url);
  request.send(payload);
  request.onload = function(evt) {
    if (request.responseText === 'Success!') {
      alert("Update page content!");
      location.reload(false);
    }
  }
}

function deletePage(){
  if (!getSession())
    return;

  var isSubPage = urlParameters["sub_page"];
  var pageName = urlParameters[isSubPage ? "sub_page" : "main_page"];

  // LOCALHOST
  var url = 'http://10.10.16.205/cmsbackend/delete_page.php?token=' + getSession() + '&isSubPage=' + (isSubPage ? true : false) + '&pageName=' + pageName + (isSubPage ? "&parentPage=" + urlParameters["main_page"] : "");

  console.log(url);

  var request = new XMLHttpRequest();

  request.open('GET', url);
  request.send();
  request.onload = function(evt) {
    console.log("Response: [" + request.response + "]");
    document.location = '/?main_page=Home';
  }
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

var lastClickedOnMainPage = false;

function makeCreatePageElement(navbar, isMainPage) {
  if(getSession()) {
    var create_li = document.createElement('li');
    var create_a = document.createElement('a');

    if (isMainPage) {
      create_a.onclick = function() {
        lastClickedOnMainPage = true;
        promptPageName();
      }
    } else {
      create_a.onclick = function() {
        lastClickedOnMainPage = false;
        promptPageName();
      }
    }

    create_a.innerText = '  +  ';
    create_li.appendChild(create_a);
    navbar.appendChild(create_li);
  } 
}

function promptPageName() {
  var page = prompt("Please enter page name", "Page name");

  if (!(page == null || page == "")) {
    if (!getSession())
      return;
  
    var isSubPage = !lastClickedOnMainPage;
    // LOCALHOST
    var url = 'http://10.10.16.205/cmsbackend/create_page.php?token=' + getSession() + '&newPage=' + page + (isSubPage ? "&parentPage=" + urlParameters["main_page"] : "");

    var request = new XMLHttpRequest();
    request.open('POST', url);
    request.send();
    request.onload = function(evt) {
      console.log(request.response);
      if (request.responseText === 'Success!') {
        alert("Made new page!");

        var redirectUrl =  "/?main_page=" + (!isSubPage ? page : urlParameters["main_page"]) + (isSubPage ? "&sub_page=" + page : "");

        document.location = redirectUrl;
      }
    }
  }
}

readStyle();
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

function updateStyle(styleNum) {
  // LOCALHOST
  var url = 'http://10.10.16.205/cmsbackend/update_style.php?token=' + getSession() + '&style=' + styleNum;

  var request = new XMLHttpRequest();
  request.open('POST', url);
  request.send();
  request.onload = function(evt) {
    if (request.responseText === 'Success!') {
      readStyle();
    }
  }
}