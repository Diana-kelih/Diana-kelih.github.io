let btnaddstudent = document.getElementById('btnaddstudent')

btnaddstudent.addEventListener('click', () => {

    let txtfname = document.getElementById("txtfname").value
    let txtlname = document.getElementById("txtlname").value
    let txtemail = document.getElementById("txtemail").value

    if(txtfname == "" || txtemail == ""){

        alert("Name and email must be filled")

    }else{

        let emailid = txtemail.replace(/\./g, "_dot_").replace(/@/g, "_at_")

        let status = document.querySelector("select").value;

        let timenow = Date.now();

        let role = "Student"

        let autopassword = "12345678"
        let txtpass = autopassword

        let user = firebase.auth().currentUser;

        let createdby = user.email

        firebase.auth().createUserWithEmailAndPassword(txtemail, txtpass)
        .then((userCredential) => {

            firebase.database().ref('userDetails/' + emailid).set({

                FirstName: txtfname,
                LastName: txtlname,
                Email: txtemail,
                Status: status,
                CreatedBy: createdby,
                Role: role,
                CreatedOn: timenow

            })

            alert("Account Created")

        })

        .catch((error) => {

            console.log(error)

            alert(error.message)

        })

    }

})

function loaddata(){

    let tablebody = document.getElementById("tablebody")

    firebase.database().ref("userDetails").on("value", (snapshot) => {

        tablebody.innerHTML = ""

        snapshot.forEach((childSnapshot) => {

            let data = childSnapshot.val()

            let key = childSnapshot.key

            if(data.Status == "active" && data.Role == "Student"){

                tablebody.innerHTML += `

                <tr>
                    <td>${data.Email}</td>
                    <td>${data.FirstName}</td>
                    <td>${data.LastName}</td>
                    <td>
                        <button class="btn btnred" onClick="suspendedstudent('${key}')">
                            Suspend
                        </button>
                    </td>
                </tr>

                `
            }

        })

    })

}

loaddata();

function suspendedstudent(studentid){

    let confirmSuspend = confirm("Are you sure you want to suspend this student?")

    if(!confirmSuspend) return;

    firebase.database().ref("userDetails/" + studentid).update({

        Status: "inactive"

    })

    .then(() => {

        alert("Student suspended")

    })

    .catch((error) => {

        alert("Error while suspended")

    })

}

// activation

function loaddatainactive(){
    let tablebodyinactive = document.getElementById('tablebodyinactive')

    firebase.database().ref("userDetails").on("value",(snapshot) =>{
        tablebodyinactive.innerHTML = "" 

        snapshot.forEach((childSnapshot) =>{
            let data = childSnapshot.val()
            let key = childSnapshot.key

            if(data.Status == "inactive" && data.Role == "Student"){
                tablebodyinactive.innerHTML += `
                    <tr>
                     <td>${data.Email}</td>
                     <td>${data.FirstName}</td>
                     <td>${data.LastName}</td>
                     <td>
                      <button class="btn btngreen" onclick="activatestudent('${key}')" > Activate</button>
                      </td>
                    </tr>
                `
            }
        })

    })
}

loaddatainactive();

function activatestudent(studentid){
    let confirmActivate = confirm("Are you sure you want to activate this student ?")
    if(!confirmActivate) return;
    firebase.database().ref("userDetails/" + studentid).update({
        Status:"active"
    })
    .then(() =>{
        alert("Student activated")
    })
    .catch((error) =>{
        alert("Error while activating")
    })

}
let lbtotalstudents = document.getElementById("lbtotalstudents")
firebase.database ().ref("userDetails").once("value",function (snapshot){
    let total= 0
    snapshot.forEach(function(childSnapshot){
        let data = childSnapshot.val()
        if (data.Role == "Student")
            total++;
        x
    });

    lbtotalstudents.innerHTML = total;
})
let lbtotalactivestudents = document.getElementById("lbtotalactivestudents")
firebase.database ().ref("userDetails").once("value",function (snapshot){
    let total= 0
    snapshot.forEach(function(childSnapshot){
        let data = childSnapshot.val()
        if (data.Status == "active" && data.Role == "Student")
            total++;
        
    });

    lbtotalactivestudents.innerHTML = total;
})
let lbtotalinactivestudents = document.getElementById("lbtotalinactivestudents")
firebase.database ().ref("userDetails").once("value",function (snapshot){
    let total= 0
    snapshot.forEach(function(childSnapshot){
        let data = childSnapshot.val()
        if (data.Status == "inactive" && data.Role == "Student")
            total++;
        
    });

    lbtotalinactivestudents.innerHTML = total;
})
let lbpendingapprovals = document.getElementById("lbpendingapprovals")
firebase.database ().ref("userDetails").once("value",function (snapshot){
    let total= 0
    snapshot.forEach(function(childSnapshot){
        let data = childSnapshot.val()
        if (data.Status == "pending" && data.Role == "Student")
            total++;
        
        
    });

    lbpendingapprovals.innerHTML = total;
})
