var url = "http://webservers2w.westeurope.cloudapp.azure.com/quepassaeh/server/public/";
const url_login = url + "login/";
const url_missatges = url + "provamissatge/";
var finestraMissatge;
var finestraLogin;
var token;
var id_usuari;
var benvinguda;

window.onload = function () {
    finestraMissatge = document.getElementById("missatge");
    finestraLogin = document.getElementById("login");
    token = document.getElementById("token");
    id_usuari = document.getElementById("idUsuari");
    benvinguda = document.getElementById("benvinguda");
    document.getElementById("loginButton").addEventListener("click", comprovaLogin);
    document.getElementById("missatgeButton").addEventListener("click", enviaMissatge);
}

function login(email, password){
    var formData = new FormData();
    formData.append('email', email);
    formData.append('password', password);
    fetch(url_login,{method: 'POST', body:formData}
        )
        .then(resposta => {
            console.log(resposta);
            if (resposta.ok) {
                return resposta.json();
            } else {
                alert('Error: ' + resposta.status);
            }
        })
        .then(
            json => {
                if(json.correcta){
                    token = json.dades.token;
                    id_usuari = json.dades.codiusuari;
                    loginCorrecte(json);
                } else{
                    alert("ERROR");
                }
            }
        )
        .catch(
            error => console.log(error)
        );
}

function comprovaLogin(){
    var usuari = document.getElementById("usuari").value.trim();
    var pass = document.getElementById("pass").value.trim();
    if(usuari != "" && pass != ""){
        console.log("Login");
        login(usuari, pass);
    } else{
        console.log("Camps buits!");
    }
}

function loginCorrecte(dades){
    finestraLogin.style.display = "none";
    finestraMissatge.style.display = "block";
    console.log(dades);
    benvinguda.innerHTML = "Benvingut " + dades.dades.nom;
    recuperaMissatges();
}

function enviaMissatge(){
    missatge = document.getElementById("missatgeInput").value.trim();
    if(missatge != ""){
        var formData = new FormData();
        formData.append('codiusuari', id_usuari);
        formData.append('msg', missatge);
        fetch(url_missatges,{method: 'POST', body:formData}
            )
            .then(resposta => {
                console.log(resposta);
                if (resposta.ok) {
                    return resposta.json();
                } else {
                    alert('Error: ' + resposta.status);
                }
            })
            .then(
                json => {
                    if(json.correcta){
                        document.getElementById("missatgeInput").value = "";
                        recuperaMissatges();
                    } else{
                        alert("ERROR");
                    }
                }
            )
            .catch(
                error => console.log(error)
            );
    }
}

function recuperaMissatges(){
    fetch(url_missatges,{method: 'GET'}
        )
        .then(resposta => {
            console.log(resposta);
            if (resposta.ok) {
                return resposta.json();
            } else {
                alert('Error: ' + resposta.status);
            }
        })
        .then(
            json => {
                if(json.correcta){
                    mostraMissatges(json);
                } else{
                    alert("ERROR");
                }
            }
        )
        .catch(
            error => console.log(error)
        );
}

function mostraMissatges(dades){
    var missatges = document.getElementById("llistaMissatges");
    let nom = "";
    missatges.innerHTML = "";
    dades.dades.forEach(missatge => {
        let div = document.createElement("div");
        let divCont = document.createElement("div");
        let divNom = document.createElement("div");
        let divData = document.createElement("div");
        div.setAttribute("class", "flex-shrink-1 bg-light rounded py-2 px-3 ml-3 msg");
        divData.setAttribute("class", "data");
        divCont.setAttribute("class", "chat-message-left pb-4 contMsg");

        if (missatge.codiusuari === id_usuari){
            divNom.setAttribute("class", "nom meu");
            nom = document.createTextNode("Jo");
        } else{
            divNom.setAttribute("class", "nom");
            nom = document.createTextNode(missatge.nom);
        }

        let text = document.createTextNode(missatge.msg);
        let data = document.createTextNode(missatge.datahora);

        divData.appendChild(data);
        divNom.appendChild(nom);
        div.appendChild(text);

        let row = document.createElement("div");
        row.setAttribute("class", "row");
        row.appendChild(divNom);
        row.appendChild(divData);
        divCont.appendChild(row);
        divCont.appendChild(div);
        missatges.appendChild(divCont);
        missatges.scrollTop = missatges.scrollHeight;
    });
}
