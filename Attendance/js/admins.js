let btnaddadmin = document.getElementById('btnaddadmin')

if (btnaddadmin) {
    btnaddadmin.addEventListener('click', () =>{
        let txtfname = document.getElementById("txtfname")?.value || ""
        let txtlname = document.getElementById("txtlname")?.value || ""
        let txtemail = document.getElementById("txtemail")?.value || ""
        let statusSelect = document.getElementById("slstatus")
        let status = statusSelect ? statusSelect.value : "active"

        if(txtfname == "" || txtemail == ""){
            alert("Name and email must be filled")
        } else {
            let emailid = txtemail.replace(/\./g, "_dot_").replace(/@/g, "_at_")
            let timenow = Date.now(); 
            let role = "Admin"
            let autopassword = "12345678"
            let user = firebase.auth().currentUser;
            let createdby = user ? user.email : "system"
            firebase.auth().createUserWithEmailAndPassword(txtemail,autopassword)
            .then((userCredential) =>{
                firebase.database().ref('userDetails/' + emailid).set({
                    FirstName:txtfname,
                    LastName:txtlname,
                    Email: txtemail,
                    Status: status,
                    CreatedBy: createdby,
                    Role: role,
                    CreatedOn: timenow
                })
                alert("New admin added password is 12345678 and username is email")
            })
            .catch((error) => {
                console.log(error)
                alert(error.message)
            })
        }
    })
} 


function loaddata(){
    let tablebody = document.getElementById('tablebody')
    if (!tablebody) return;

    firebase.database().ref("userDetails").on("value",(snapshot) =>{
        tablebody.innerHTML = ""

        snapshot.forEach((childSnapshot) =>{
            let data = childSnapshot.val()
            let key = childSnapshot.key

            if(data.Status == "active" && data.Role == "Admin"){
                tablebody.innerHTML += `
                    <tr>
                     <td>${data.Email}</td>
                     <td>${data.FirstName}</td>
                     <td>${data.LastName}</td>
                     <td>
                      <button class="btn btnred" onclick="suspendadmin('${key}')" > Suspend</button>
                      </td>
                    </tr>
                `
            }
        })
    })
}

loaddata();


function suspendadmin(adminid){
    let confirmSuspend = confirm("Are you sure you want to suspend this admin ?")
    if(!confirmSuspend) return;
    firebase.database().ref("userDetails/" + adminid).update({
        Status:"inactive"
    })
    .then(() =>{
        alert("Admin suspended")
    })
    .then((error) =>{
        alert("Error while suspending")
    })

}




// activation  254740409701


function loaddatainactive(){
    let tablebody = document.getElementById('tablebodyinactive')
    if (!tablebody) return;

    firebase.database().ref("userDetails").on("value",(snapshot) =>{
        tablebody.innerHTML = ""

        snapshot.forEach((childSnapshot) =>{
            let data = childSnapshot.val()
            let key = childSnapshot.key

            if(data.Status == "inactive" && data.Role == "Admin"){
                tablebody.innerHTML += `
                    <tr>
                     <td>${data.Email}</td>
                     <td>${data.FirstName}</td>
                     <td>${data.LastName}</td>
                     <td>
                      <button class="btn btngreen" onclick="activateadmin('${key}')" > Activate</button>
                      </td>
                    </tr>
                `
            }
        })
    })
}

loaddatainactive();


function activateadmin(adminid){
    let confirmSuspend = confirm("Are you sure you want to activate this admin ?")
    if(!confirmSuspend) return;
    firebase.database().ref("userDetails/" + adminid).update({
        Status:"active"
    })
    .then(() =>{
        alert("Admin activated")
    })
    .then((error) =>{
        alert("Error while activating")
    })

}
//count total admins
let lbtotaladmins = document.getElementById("lbtotaladmins")
if (lbtotaladmins) {
    firebase.database().ref("userDetails").on("value", function(snapshot) {
        let total = 0
        snapshot.forEach(function(childSnapshot) {
            let data = childSnapshot.val()
            if (data.Role == "Admin")
                total++;
        });
        lbtotaladmins.innerHTML = total;
    })
}

//count active admins
let lbtotalactiveadmins = document.getElementById("lbtotalactiveadmins")
if (lbtotalactiveadmins) {
    firebase.database().ref("userDetails").on("value", function(snapshot) {
        let total = 0
        snapshot.forEach(function(childSnapshot) {
            let data = childSnapshot.val()
            if (data.Status == "active" && data.Role == "Admin")
                total++;
        })
        lbtotalactiveadmins.innerHTML = total;
    })
}
//count inactive admins
let lbtotalinactiveadmins = document.getElementById("lbtotalinactiveadmins")
if (lbtotalinactiveadmins) {
    firebase.database().ref("userDetails").on("value", function(snapshot) {
        let total = 0
        snapshot.forEach(function(childSnapshot) {
            let data = childSnapshot.val()
            if (data.Status == "inactive" && data.Role == "Admin")
                total++;
        });
        lbtotalinactiveadmins.innerHTML = total;
    })
}


let lbpendingapprovals = document.getElementById("lbpendingapprovals")
if (lbpendingapprovals) {
    firebase.database().ref("userDetails").on("value", function(snapshot) {
        let total = 0
        snapshot.forEach(function(childSnapshot) {
            let data = childSnapshot.val()
            if (data.Status == "pending" && data.Role == "Admin")
                total++;
        });
        lbpendingapprovals.innerHTML = total;
    })
}