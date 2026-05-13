 let btnlogin =document.getElementById('btnlogin')
 btnlogin.addEventListener("click", () => {
let txtusername = document.getElementById("txtusername").value
let txtpass = document.getElementById("txtpass").value
btnlogin.innerHTML = "please wait..."
if(
    txtusername == "" || txtpass == "" ){
        alert("Please fill all details")
    }else{
        firebase.auth ().setPersistence(firebase.auth.Auth.Persistence.SESSION)
        .then(() => {
            return firebase.auth().signInWithEmailAndPassword(txtusername,txtpass)
        })
        .then((userCredentials) => {
            
  		let emailid = txtusername.replace(/\./g, "_dot_").replace(/@/g, "_at_")
        return firebase.database().ref("userDetails/" +emailid).once("value")
        })
        .then((snapshot) => {
const userDetails = snapshot.val();
const role = userDetails .Role;
const status = userDetails.Status;
if(status == "Active"){
    if(role == "Admin"){
        //admin
        window.location.href = "dashboard.html"
    }else if (role == "Student"){
        //Student 
        alert("student logged in")
  }else{
    //active users with no role
    alert("No role added connect with admin")

    }
}else{
    //inactive account
    alert("Account blocked connect with admin")
}

        })
        .catch((error) =>{
            alert("wrong credentials")
            btnlogin.innerHTML = "Log in"
        })
        
    }
})
