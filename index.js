var express=require('express')// import modulul express
var app=express();//aici am creat serverul
var path= require('path');
var formidable= require('formidable');
var nodemailer=require('nodemailer');
const crypto = require('crypto');
var fs=require('fs');
const session = require('express-session');
var mysql=require('mysql');



app.use(session({//setez o sesiune
    secret: 'abcdefg',//folosit de express session pentru criptarea id-ului de sesiune
    resave: true,
    saveUninitialized: false
}));


app.set('view engine', 'ejs');//setez drept compilator de template-uri ejs (setez limbajul in care vor fi scrise template-urile)



console.log(__dirname); //predefinita - calea pe masina serverului
console.log(path.join(__dirname, "Resurse"));
app.use(express.static(path.join(__dirname, "Resurse")));
app.use(express.static(path.join(__dirname, "poze_uploadate")));


//-------------------------------- conectare baza de date ---------------------------------------

var conexiune=mysql.createConnection({
    host:"localhost",
    user:"UserProduse",
    password:"parola",
    database:"proiect"

});

conexiune.connect(function (err){
    if(err) {
        console.log("Conexiune esuata");
    }
    else
    {
        console.log("Conexiune mysql cu succes");
    }


});


function getUtiliz(req){
    var utiliz;
    if(req.session){
        utiliz=req.session.utilizator
    }
    else{utiliz=null}
    return utiliz;
}




//------------------------------------------------------------------------PRODUSE-------------------------------------------------

conexiune.query("select * from produse",function(err,rezultat,campuri){
    if(err) throw err;
    console.log(rezultat);

});





// // aici astept cereri de forma localhost:8080 (fara nimic dupa)
// app.get('/', function(req, res){
//
//     res.render('pagini/index');//afisez index-ul in acest caz
// });




app.get('/produse', function(req, res){

    conexiune.query("select * from produse",function(err,rezultat,campuri){
        if(err) throw err;
        console.log(rezultat);
        res.render('pagini/produse',{produse:rezultat,utilizator:getUtiliz(req)});//afisez index-ul in acest caz
    });

});



app.get('/produs/:id', function(req, res){
    var idProdus=req.params.id;

    conexiune.query("select * from produse where id="+idProdus,function(err,rezultat,campuri){
        if(err) throw err;
        console.log(rezultat);
        res.render('pagini/pag_produs',{produs_unic:rezultat[0],utilizator:getUtiliz(req)});//afisez index-ul in acest caz
    });

});





//--------------------------------------------------------------------------ALTE PAGINI DIN MENIU-------------------------------------------------------------


//cerere serviciu
app.get('/Galerie_statica', function(req, res){
    res.render('pagini/Galerie_statica',{utilizator:getUtiliz(req)});
});
app.get('/Notiuni_introductive', function(req, res){
    res.render('pagini/Notiuni_introductive',{utilizator:getUtiliz(req)});
});
app.get('/Galerie_animata', function(req, res){
    res.render('pagini/Galerie_animata',{utilizator:getUtiliz(req)});
});





//-------------------------------- pagina home ---------------------------------------

// cand se face o cerere get catre pagina de index
app.get('/', function(req, res) {
    if (req.session){
        console.log(req.session.utilizator);

        res.render('pagini/index', {utilizator:req.session.utilizator});
    }
    else{
        res.render('pagini/index');
    }



});





//-----------------------------------------------------------------------inregistrare UTILIZATOR------------------------------------------------------------





async function trimiteMail(username, email){
    var transp= nodemailer.createTransport({
        service: "gmail",
        secure: false,
        auth:{//date login
            user:"tutoriale.modelare.3d.tw@gmail.com",
            pass:"iubesc_modelarea_3d"
        },
        tls:{
            rejectUnauthorized:false
        }
    });
    //genereaza html
    await transp.sendMail({
        from:"tutoriale.modelare.3d.tw@gmail.com",
        to:email,
        subject:"Mesaj inregistrare",
        text:"Pe site-ul Tutoriale de modelare 3D ai username-ul " +username+ "incepand de azi"+ new Date(),
        html:"<p> Pe site-ul Tutoriale de modelare 3D ai username-ul " + username + " incepand de azi , <span style='text-decoration: underline; color:purple'>" + new Date() + "</span></p>",
    })
    console.log("trimis mail");
}




var parolaServer="parola";
app.post("/inreg",function(req, res){
    var username;
    var formular= formidable.IncomingForm()
    console.log("am intrat pe post");

    //nr ordine: 4
    formular.parse(req, function(err, campuriText, campuriFisier) {//se executa dupa ce a fost primit formularul si parsat
        console.log("parsare")
        var eroare = "";
        console.log(campuriText);
        //verificari campuri
        if (campuriText.username == "" || campuriText.username == " ") {
            eroare += "Username nesetat<br>";
        }
        // verificare daca exista deja username-ul in tabelul de utilizatori

        if (campuriText.nume == "" || campuriText.nume == " ") {
            eroare += "Nume nesetat<br>";
        }
        if (campuriText.prenume == "" || campuriText.prenume == " ") {
            eroare += "Prenume nesetat<br>";
        }

        if (campuriText.parola == "" || campuriText.parola == " ") {
            eroare += "Parola nesetata<br>";
        }

        if (campuriText.email == "" || campuriText.email == " ") {
            eroare += "Email nesetat<br>";
        }

        if (eroare == "")
        {
            unescapedUsername = campuriText.username;
            unescapedEmail = campuriText.email;

            var copie_username=campuriText.username
            campuriText.username = mysql.escape(campuriText.username);
            campuriText.nume = mysql.escape(campuriText.nume);
            campuriText.prenume = mysql.escape(campuriText.prenume);
            campuriText.email = mysql.escape(campuriText.email);
            var parolaCriptata = mysql.escape(crypto.scryptSync(campuriText.parola, parolaServer, 32).toString("ascii"));
            parolaCriptata = mysql.escape(parolaCriptata);

            if (campuriText.problema_vedere) {
                problema = 1;
            } else {
                problema = 0;
            }
            campuriText.fotografie = mysql.escape(campuriText.fotografie);


            var preluare = `select id from utilizatori where username=${campuriText.username}`;
            conexiune.query(preluare, function (err, rez, campuri) {
                    if (err) {
                        console.log(err);
                        throw err;
                    }
                    if (rez.length != 0) {
                        eroare += "Username deja existent<br>";
                        console.log("eroare 1:",eroare);
                        res.render("pagini/inregistrare_user", {err: eroare, raspuns: "Completati corect campurile "});
                    }
                    else {

                        var cale_fisier;
                        if(campuriFisier.fotografie){
                            cale_fisier =copie_username + "/" + campuriFisier.fotografie.name;

                            console.log(campuriFisier.fotografie)
                            console.log(campuriFisier.fotografie.name)
                        }



                        var comanda = `insert into utilizatori (username , nume , prenume , email , parola, problema_vedere , fotografie) values(${campuriText.username},${campuriText.nume},${campuriText.prenume},${campuriText.email},${parolaCriptata},${problema},'${cale_fisier}')`;
                        console.log(comanda);
                        conexiune.query(comanda, function (err, rez, campuri) {
                            if (err) {
                                console.log(err);
                                throw err;
                            }
                             trimiteMail(unescapedUsername,  unescapedEmail);
                            console.log("ceva");
                            res.render("pagini/inregistrare_user", {err: "", raspuns: "Date introduse"});
                        })
                    }


            })

        }

         else {
             console.log("eroare 2:",eroare);
         res.render("pagini/inregistrare_user", {err: eroare, raspuns: "Completati corect campurile"});
         }


    })




    //nr ordine: 1
    formular.on("field", function(name,field){
        if(name=='username')
            if(!(field.includes('\\') || field.includes('/')))
                username=field;
            else
                username="defaultFolder";
        console.log("camp - field:", name)
    });

    //nr ordine: 2
    formular.on("fileBegin", function(name,campFisier){
        console.log("inceput upload: ", campFisier);
        if(campFisier && campFisier.name!=""){
            //am  fisier transmis
            var cale=__dirname+"/poze_uploadate/"+username
            if (!fs.existsSync(cale))
                fs.mkdirSync(cale);
            campFisier.path=cale+"/"+campFisier.name;
            console.log(campFisier.path);
        }
    });

    //nr ordine: 3
    formular.on("file", function(name,field){
        console.log("final upload: ", name);
    });
});





//-------------------------------- logare si delogare utilizator ---------------------------------------


app.post("/login",function(req, res){
    var formular= formidable.IncomingForm()
    console.log("am intrat pe login");

    formular.parse(req, function(err, campuriText, campuriFisier){//se executa dupa ce a fost primit formularul si parsat

        var parolaCriptata=mysql.escape(crypto.scryptSync(campuriText.parola,parolaServer,32).toString("ascii"));
         parolaCriptata = mysql.escape(parolaCriptata);

        campuriText.username=mysql.escape(campuriText.username)

        var comanda=`select username, rol, email, problema_vedere from utilizatori where username=${campuriText.username} and parola=${parolaCriptata}`;
        console.log(comanda);

        conexiune.query(comanda, function(err, rez, campuri){

            if(rez && rez.length==1){
                req.session.utilizator={
                    rol:rez[0].rol,
                    username:rez[0].username,
                    email:rez[0].email,
                    problema_vedere:(rez[0].problema_vedere ? "FontDublu":"")
                }
                console.log(req.session.utilizator);
                res.render("pagini/index",{utilizator:req.session.utilizator});
            }
            else{
                res.render("pagini/index");
            }
        });
    });
});

app.get('/logout', function(req, res){
    console.log("logout");
    req.session.destroy();
    res.render("pagini/index");
});



//-------------------------------- actiunile admin-ului: afisare si stergere utilizator ---------------------------------------

app.get('/useri', function(req, res){

    if(req.session && req.session.utilizator && req.session.utilizator.rol=="admin"){
        conexiune.query("select * from utilizatori",function(err, rezultat, campuri){
            if(err) throw err;
            console.log(rezultat);
            res.render('pagini/useri',{useri:rezultat, utilizator:getUtiliz(req)});//afisez index-ul in acest caz
        });
    } else{
        res.render('pagini/eroare',{mesaj:"Nu aveti acces", utilizator:req.session.utilizator});
    }

});


app.post("/sterge_utiliz",function(req, res){
    if(req.session && req.session.utilizator && req.session.utilizator.rol=="admin"){
        var formular= formidable.IncomingForm()
        console.log("am intrat pe login");

        formular.parse(req, function(err, campuriText, campuriFisier){
            var comanda=`select username from utilizatori where id='${campuriText.id}'`;
            const fs = require('fs');
            conexiune.query(comanda, function(err, rez, campuri){
                var cale = __dirname  +"/poze_uploadate/"+ rez[0].username;
                fs.rmdir(cale,{ recursive:true}, function() {console.log("Am sters!!!")});

            });

             comanda=`update utilizatori set fotografie=NULL where id='${campuriText.id}'`;
            console.log(comanda);
            conexiune.query(comanda, function(err, rez, campuri){

            });


        });
    }
    res.render("pagini/index",{utilizator:req.session.utilizator});

});





//aici astept orice tip de cerere (caracterul special * care tine loc de orice sir)
app.get('/*', function(req, res){

    var utiliz=null;

    if (req.session){
        utiliz=req.session.utilizator;
    }
    else{
      utiliz=null;
    }








    res.render('pagini/'+req.url,{utilizator:utiliz}, function(err, rezRandare){
        if(err){//intra doar cand avem eroare
            if(err.message.includes("Failed to lookup view"))
                res.status(404).render('pagini/404',{utilizator:utiliz});
            else
                throw err;
        }
        else{
            //console.log(rezRandare);
            res.send(rezRandare);
        }
    });//afisez pagina ceruta dupa localhost:8080
    //de exemplu pentru localhost:8080/pag2 va afisa fisierul /pag2 din folderul pagini
    console.log(req.url);//afisez in consola url-ul pentru verificare
});

app.listen(8080);//serverul asculta pe portul 8080
console.log("A pornit serverul pe portul 8080");//afisez in consola un mesaj sa stiu ca nu s-a blocat


