
function creeazaLi(lista, val_text){
    let li=document.createElement("li")
    lista.appendChild(li);
    li.innerHTML=val_text;
}

function f_pentru_buton(){
    var elem = document.getElementById("toggleButton");

    document.body.className= (document.body.className=="light") ? "dark" : "light";

    localStorage.setItem("theme", document.body.className);

    elem.className= (elem.className=="moonButton") ? "sunButton" : "moonButton";

    localStorage.setItem("button", elem.className);

}

function checkTheme() {
    const localStorageTheme = localStorage.getItem("theme");


    if (localStorageTheme != null && localStorageTheme == "dark") {
        document.body.className = localStorageTheme;
    }
    if (localStorageTheme != null && localStorageTheme == "light") {
        document.body.className = localStorageTheme;
    }
}

function checkButton(){

    var elem = document.getElementById("toggleButton");

    const localStorageButton = localStorage.getItem("button");

    if (localStorageButton != null ){
        elem.className = localStorageButton;
    }

}



window.addEventListener("load", function () {
    var linksMenu = document.querySelectorAll("ul.menu a");
    var location = window.location.pathname;
    location = (location == "/") ? "/index.html" : location;
    var lochash = window.location.hash;

    for (var link of linksMenu) {
        link.style.backgroundColor = "black";
        if (link.href.endsWith(location)) {
            link.style.backgroundColor = "blue";
        }

        link.addEventListener("click", function () {
            var chMenu = document.getElementById("ch-menu");
            chMenu.checked = false;
            var chSubmenu = document.getElementsByClassName("ch-submenu");

            for (var chs of chSubmenu) {
                chs.checked = false;
            }
        })
    }


        //selectez doar linkurile catre sectiuni interne in pagina
        var linkuriInterne = document.querySelectorAll("a[href*='#']");
        console.log(linkuriInterne.length);

        for (var lnk of linkuriInterne) {
            //linkurilor interne le asociez un eveniment la click
            //vreau sa verifica daca linkurile sunt in aceeasi pagina
            var paghref = lnk.href.substring(lnk.href.lastIndexOf("/"), lnk.href.lastIndexOf("#"))
            var locationhref = window.location.href
            var paglocation = locationhref.substring(locationhref.lastIndexOf("/"), locationhref.lastIndexOf("#"))
            //fac scroll animat doar daca sunt in aceeasi pagina
            if (paglocation == paghref)
                lnk.addEventListener("click", clickLink);
        }





//folosit in setInterval-ul care realizeaza scroll-ul animat
    var idIntervalPlimbare = -1;

    function clickLink(ev) {
        ev.preventDefault() //opresc actiunea default (browserul se ducea singur la locatia linkului, dar noi vrem sa se duca animat pana acolo)

        //opresc o animatie existenta
        clearInterval(idIntervalPlimbare)
        var ch
        var lnk = ev.target
        //ascunderea submeniului la click
        if (lnk.parentNode.parentNode.classList.contains("submenu")) {
            var checkboxes = document.getElementsByClassName("ch-submenu")
            for (ch of checkboxes)
                ch.checked = false

            document.getElementById("ch-menu").checked = false
        } else if (lnk.parentNode.parentNode.classList.contains("menu")) {
            document.getElementById("ch-menu").checked = false
        }


        var coordScroll;
        var poz = lnk.href.indexOf("#");
        var idElemScroll = lnk.href.substring(poz + 1);
        if (idElemScroll == "") {
            coordScroll = 0;
        } else {
            coordScroll = getOffsetTop(document.getElementById(idElemScroll)) //eventual scad inaltimea meniului, ca sa nu fie titlul sectiunii acoperit de meniu
        }
        var distanta = coordScroll - document.documentElement.scrollTop
        console.log(distanta)
        //stabilesc pasul de scroll, pozitiv sau negativ in functie de directia de scroll
        pas = distanta < 0 ? -20 : 20;
        //pornesc un setInterval care la fiecare 10ms va da un scroll cu 20px pana ajunge la destinatie, realizand astfel animatia
        //ultimul parametru transmis functiei plimba este ceea ce vine dupa # in link, de exemplu pentru "pagina.html#abc", se transmite doar "abc"
        idIntervalPlimbare = setInterval(plimba, 10, pas, coordScroll, lnk.href.substring(lnk.href.lastIndexOf("#") + 1))
    }


    /*functia merge din parinte in parinte adunand offseturile(spatiile de la granita de sus a elementului fiu la granita de sus a elementului parinte), pentru a obtine offsetTop-ul fata de pagina*/
    function getOffsetTop(elem) {
        var rez = elem.offsetTop;
        while (elem.offsetParent && elem.offsetParent != document.body) {
            elem = elem.offsetParent;
            rez += elem.offsetTop;
        }
        return rez;

    }


    function plimba(pas, coordScroll, href) {
        //daca incerc sa incrementez scrollTop cand e deja la finalul ferestrei, acesta nu isi va schimba valoarea
        //deci pot sa testez daca e la final comparand scrollVechi cu scrollTop dupa incrementare
        scrollVechi = document.documentElement.scrollTop;
        document.documentElement.scrollTop += pas
        /*am trei cazuri
        - pasul e pozitiv si deci merg in jos, asadar daca scrollTop e egal sau a depasit in jos coordonata la care doream sa ajung, ma opresc
        - pasul e negativ si deci merg in sus, asadar daca scrollTop e egal sau a depasit in sus coordonata la care doream sa ajung, ma opresc
        - sunt la un capat de pagina, si scrolltop nu se mai modifica desi il incrementez/decrementez, (verifc asta comparandu-l cu scrollTop-ul vechi)
        */
        if (pas > 0 && coordScroll <= document.documentElement.scrollTop || pas < 0 && coordScroll >= document.documentElement.scrollTop || scrollVechi == document.documentElement.scrollTop) {
            //opresc animatia
            clearInterval(idIntervalPlimbare)
            //schimb in bara de adrese astfel incat sa se vada sectiunea la care am ajuns
            window.location.hash = href
        }



    }

    checkTheme();
    checkButton();



})