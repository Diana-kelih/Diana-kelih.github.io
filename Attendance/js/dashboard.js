let lbtotalstudents = document.getElementById("lbtotalstudents")
if (lbtotalstudents) {
    firebase.database().ref("userDetails").once("value", function(snapshot) {
        let total = 0
        snapshot.forEach(function(childSnapshot) {
            let data = childSnapshot.val()
            total++;
        });
        lbtotalstudents.innerHTML = total;
    })
}

let lbtotalcourses = document.getElementById("lbtotalcourses")
if (lbtotalcourses) {
    firebase.database().ref("Courses").once("value", function(snapshot) {
        let total = 0
        snapshot.forEach(function(childSnapshot) {
            let data = childSnapshot.val()
            total++;
        });
        lbtotalcourses.innerHTML = total;
    })
}


let lbtotallecturer = document.getElementById("lbtotallecturer")
firebase.database ().ref("userDetails").once("value",function (snapshot){
    let total= 0
    snapshot.forEach(function(childSnapshot){
        let data = childSnapshot.val()
        if (data.Role == "Admin")
            total++;
        
    });
    lbtotallecturer.innerHTML = total;
})
let lbtotalapprovals = document.getElementById("lbtotalapprovals")
firebase.database ().ref("userDetails").once("value",function (snapshot){
    let total= 0
    snapshot.forEach(function(childSnapshot){
        let data = childSnapshot.val()
        if (data.Role == "inactive")
            total++;
        
    });
    lbtotalapprovals.innerHTML = total;
})