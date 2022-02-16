var url = "http://missatgeria.dawpaucasesnoves.com/api/public/";
const url_login = url + "login/";
const url_missatges = url + "provamissatge/";
const url_usuari = url + "provausuari/";
var finestraMissatge;
var finestraLogin;
var finestraPerfil;
var token;
var id_usuari;
var benvinguda;
var missatges;
var pass;

window.onload = function () {
    missatges = document.getElementById("llistaMissatges");
    finestraMissatge = document.getElementById("missatge");
    finestraLogin = document.getElementById("login");
    finestraPerfil = document.getElementById("perfil");
    token = document.getElementById("token");
    id_usuari = document.getElementById("idUsuari");
    benvinguda = document.getElementById("benvinguda");
    document.getElementById("loginButton").addEventListener("click", comprovaLogin);
    document.getElementById("missatgeButton").addEventListener("click", enviaMissatge);
    document.getElementById("perfilButton").addEventListener("click", canviaPerfil);
    document.getElementById("cancelaPerfil").addEventListener("click", canviaMissatge);
    document.getElementById("dataInput").addEventListener("change", missatgesData);
    document.getElementById("guardaPerfil").addEventListener("click", actualitzaPerfil);
}

function missatgesData(){
    var data = document.getElementById("dataInput").value.replaceAll("-", "/");
    fetch(url_missatges + data,{method: 'GET'}
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
                missatges.innerHTML = ""
                afegeixNousMissatges(json);
            } else{
                alert("ERROR");
            }
        }
    )
    .catch(
        error => console.log(error)
    );
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
    pass = document.getElementById("pass").value.trim();
    if(usuari != "" && pass != ""){
        console.log("Login");
        login(usuari, pass);
    } else{
        console.log("Camps buits!");
    }
}

function loginCorrecte(dades){
    finestraLogin.style.display = "none";
    finestraMissatge.style.display = "flex";
    console.log(dades);
    benvinguda.innerHTML = "Benvingut " + dades.dades.nom;
    setInterval(comprovaMissatgesNous, 5000);
    recuperaMissatges();
}

function canviaPerfil(){
    finestraMissatge.style.display = "none";
    finestraPerfil.style.display = "flex";
    rellenaPerfil();
}
function canviaMissatge(){
    finestraPerfil.style.display = "none";
    finestraMissatge.style.display = "flex";
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
                        comprovaMissatgesNous();
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
                    afegeixNousMissatges(json);
                } else{
                    alert("ERROR");
                }
            }
        )
        .catch(
            error => console.log(error)
        );
}

function comprovaMissatgesNous(){
    fetch(url_missatges + id_usuari,{method: 'GET'}
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
                if(json.rowcount != 0){
                    afegeixNousMissatges(json);
                }
            } else{
                alert("ERROR");
            }
        }
    )
    .catch(
        error => console.log(error)
    );
}

function afegeixNousMissatges(dades){
    let nom = "";
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

//PERFIL

function rellenaPerfil(){
    fetch(url_usuari + id_usuari,{method: 'GET'}
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
                document.getElementById("nomPerfil").value = json.dades.nom;
                document.getElementById("emailPerfil").value = json.dades.email;
                document.getElementById("fotoPerfil").value = json.dades.foto;
                document.getElementById("passPerfil").value = pass;
            } else{
                alert("ERROR");
            }
        }
    )
    .catch(
        error => console.log(error)
    );
}

function actualitzaPerfil(){
    var formData = new FormData();
    formData.append('email', document.getElementById("emailPerfil").value);
    formData.append('nom', document.getElementById("nomPerfil").value);
    formData.append('password', document.getElementById("passPerfil").value);
    formData.append('foto', document.getElementById("fotoPerfil").files[0]);
    fetch(url_usuari + id_usuari,{method: 'POST', body:formData}
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
                    console.log(json);
                } else{
                    alert("ERROR");
                }
            }
        )
        .catch(
            error => console.log(error)
        );
}
