var url = "http://webservers2w.westeurope.cloudapp.azure.com/quepassaeh/server/public/";
const url_login = url + "login/";
var finestraMissatge;
var finestraLogin;

window.onload = function () {
    finestraMissatge = document.getElementById("missatge");
    finestraLogin = document.getElementById("login");
    var botoLogin = document.getElementById("loginButton");
    botoLogin.addEventListener("click", comprovaLogin);
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
}