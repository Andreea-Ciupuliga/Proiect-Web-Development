
window.onload = function () {

    document.getElementById("filtrare").onclick = function () {

        var nume_produs_input = document.getElementById("i_text").value;
        var pret_input = document.getElementById("i_pret").value;
        var categorie_input = document.getElementsByName("gr_rad");
        var disponibilitate_in_stoc_input = document.getElementById("i_check2").checked;
        var nu_disponibilitate_in_stoc_input = document.getElementById("i_check3").checked;
        var descriere_input=document.getElementById("i_textarea").value;
        var nivel_input = document.getElementById("i_sel_simplu").value;
        var materiale_input = document.getElementById("i_sel_multiplu").options;

        var produse = document.querySelectorAll("article");





        sir="";
        for(let rad of categorie_input){

            if(rad.checked){
                sir=rad.value;
                break;//iesim din for deaorece doar un radiobutton din grup poate fi bifat (si tocmai l-am gasit)
            }

        }

        var lista = [];
        for(let opt of materiale_input){
            if(opt.selected)
                lista.push(opt.value);
        }



        for (var prod of  produse) {
            prod.style.display = "block";

            var Nume_produs = prod.getElementsByClassName("nume")[0];
            var Pret = prod.getElementsByClassName("pret")[0].textContent;
            var Categorie = prod.getElementsByClassName("categorie")[0];
            var Disponibilitate_stoc = prod.getElementsByClassName("disponibilitate_stoc")[0];
            var Descriere = prod.getElementsByClassName("descriere")[0];
            var Nivel = prod.getElementsByClassName("nivel")[0];
            var Material = prod.getElementsByClassName("materiale")[0];


            var conditie1 = 1;      //mi se strica conditia totala daca nu scriu asta
            if(nume_produs_input != ""){
                conditie1 = (Nume_produs.innerHTML.toLowerCase().includes(nume_produs_input.toLowerCase())); //verific daca subsirul se gaseste in sir
            }

            var conditie2 = (parseInt(Pret) <= parseInt(pret_input));

            var conditie3 = ((sir.trim() == Categorie.innerHTML.trim()) || sir=="nimic" );

            var conditie4_disponibilitate = (disponibilitate_in_stoc_input && Disponibilitate_stoc.innerHTML == 1);
            var conditie4_nu_disponibilitate = (nu_disponibilitate_in_stoc_input && Disponibilitate_stoc.innerHTML == 0);

            var conditie5=1;      //mi se strica conditia totala daca nu scriu asta
            if(descriere_input!="")
            {
                conditie5=(Descriere.innerHTML.toLowerCase().includes(descriere_input.toLowerCase()));
            }

            var conditie6 = ((nivel_input.trim() == Nivel.innerHTML.trim()) || (nivel_input=="nimic"));


            var materiale = Material.innerHTML.split(",");
            var conditie7 = false;
            for(elem of lista){
                if(materiale.includes(elem)) {
                    conditie7 = true;
                }
            }

                var conditie_totala =conditie7 && conditie6 && conditie5 && conditie3 && conditie1 && conditie2 && (conditie4_disponibilitate || conditie4_nu_disponibilitate);


                if (conditie_totala == false) {//pe cele pe care le ascund
                    prod.style.display = "none";

                }

            }
    }

            document.getElementById("i_pret").onchange = function () {
                // pt ca suntem intr-o metoda , putem folosi this pt a accesa instanta (care e inputul range)
                document.getElementById("info_range").innerHTML = this.value;
            }






    document.getElementById("sort_asc").onclick = function(){
        var container = document.getElementById("pentru_sortare")

        var nivel = container.children

        var nivel_array = Array.from(nivel) //facem vector deoarece inainte e colectie


        nivel_array.sort(function(a,b){//elementele pe care le compara a<b returneaza -1 a>b returneaza 1 a=b returneaza 0
            if(a.getElementsByClassName("nivel")[0].textContent.localeCompare(b.getElementsByClassName("nivel")[0].textContent) == - 1 ){
                //[0] ptc e un singur element
                //localeCompare compara 2 stringuri
                //localCompare returneaza -1 daca primul < al doilea
                return -1;
            }
            if(a.getElementsByClassName("nivel")[0].textContent.localeCompare(b.getElementsByClassName("nivel")[0].textContent) == 1 ){
//retu          //localCompare returneaza 1 daca primul > al doilea
                return 1;
            }
            else{//adica daca a=b comparam dupa pret

                var a_pret = a.getElementsByClassName("pret")[0].textContent.trim()[0]
                var b_pret = b.getElementsByClassName("pret")[0].textContent.trim()[0]

                return a_pret - b_pret
            }
        })

        for(var i = 0; i < nivel_array.length; i++){
            let aux = nivel_array[i]

            container.appendChild(aux)
        }
    }







    document.getElementById("sort_desc").onclick = function(){
        var container = document.getElementById("pentru_sortare")

        var nivel = container.children


        var nivel_array = Array.from(nivel)


        nivel_array.sort(function(a,b){ //elementele pe care le compara a<b returneaza -1 a>b returneaza 1 a=b returneaza 0

            if(a.getElementsByClassName("nivel")[0].textContent.localeCompare(b.getElementsByClassName("nivel")[0].textContent) == -1 ){
                //localCompare returneaza -1 daca primul < al doilea

                return 1;
            }



            if(a.getElementsByClassName("nivel")[0].textContent.localeCompare(b.getElementsByClassName("nivel")[0].textContent) ==  1 ){
                //localCompare returneaza 1 daca primul > al doilea
                return -1;
            }

            else{

                var a_pret = a.getElementsByClassName("pret")[0].textContent;
                var b_pret = b.getElementsByClassName("pret")[0].textContent;

                return b_pret - a_pret
            }
        })

        for(var i = 0; i < nivel_array.length; i++){
            let aux = nivel_array[i]
            console.log(aux)
            container.appendChild(aux)
        }
    }






    document.getElementById("average").onclick = function(){
        var average = 0
        var count = 0

        var container = document.getElementById("pentru_sortare")
        var preturi = container.children
        var preturi_array = []

        for(var pret of preturi){
            if(pret.style.display != "none"){
                preturi_array[count] = pret
                count = count + 1
                var pret_curent = pret.getElementsByClassName("pret")[0].textContent.split(" ")[0]
                average = average + Number(pret_curent)

            }
        }


            average = Number(average/count)
            alert( "Media preturilor pentru produsele selectate este: "+average + " RON")


    }




    document.getElementById("resetare_filtre").onclick = function(){

        document.getElementById("i_text").value = "";
        document.getElementById("i_pret").value = "30";
        document.getElementById("info_range").innerHTML = "30";
        document.getElementById("i_rad").checked = true;
        document.getElementById("i_textarea").value = "";
        document.getElementById("i_sel_simplu").value = "nimic";
        document.getElementById("i_check2").checked = true;
        document.getElementById("i_check3").checked = true;

        var options = document.getElementById("i_sel_multiplu").options
        for (var opt of options){
            opt.selected = true;
        }
    }

}