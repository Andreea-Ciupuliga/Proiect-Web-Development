function validateForm() {
    var parola_input=document.getElementById("parola").value

    var reparola_input=document.getElementById("reparola").value

    var rez =(parola_input == reparola_input)

    var rez2=false;
    if (rez == false)
    {
        alert("parolele nu coincid!!!")
    }


    if (parola_input.match(new RegExp("[A-Z]+"))  && parola_input.match(new RegExp("[a-z]+")) && parola_input.match(new RegExp("[0-9]+.*[0-9]+")) &&  parola_input.match(new RegExp("\\.+")))
    {
       alert("parola  e corecta")
        rez2=true
    }
    else
        alert("parola NU este corecta")

    var username = document.getElementById("username").value;
    var nume = document.getElementById("nume").value;
    var prenume = document.getElementById("prenume").value;
    var email = document.getElementById("email").value;

    if (username != "" || nume != "" || prenume != "" || email != "" ) {
        alert ("Introduceti toate campurile!");
    }


    var final=rez && rez2
    return final
}