let totalAdmins = 0
let totalStudents = 0
firebase.database ().ref("userDetails").once("value",function (snapshot){
    let total= 0
    snapshot.forEach(function(childSnapshot){
        let data = childSnapshot.val()
        if (data.Role == "Admin"){
            totalAdmins++;
            console.log(totalAdmins);
    }else{

      totalStudents++
      console.log(totalStudents);
    }
    });
  //display total count
   drawBarGraph()
})

function drawBarGraph() {
    const canvasforbargraph = document.getElementById('mybargraph')
    new Chart(canvasforbargraph, {

type : 'bar',
data: {
    labels : ['Admins', 'Students'],
    datasets : [{
    label : 'System Users',
    data : [totalAdmins, totalStudents],
    borderWidth : 1
    }]
},
options :{
    responsive:true,
    scales :{
        y:{
            beginAtZero:true
        }
    }

}
    
    })
}


let totalActiveCourses = 0
let totalInactiveCourses = 0
firebase.database ().ref("Courses").once("value",function (snapshot){

  let total= 0
    snapshot.forEach(function(childSnapshot){
        let data = childSnapshot.val()
        if (data.Status == "active"){
            totalActiveCourses++
        console.log(totalActiveCourses);
 }else{

      totalInactiveCourses++
      console.log(totalInactiveCourses);
    }
    });

  //display total count
   drawPieChart()
})

function drawPieChart() {
    const canvasforpiechart = document.getElementById('mypiechart')
    new Chart(canvasforpiechart, {
type : 'pie',
data: {
    labels : ['Active Courses', 'Inactive Courses'],
    datasets : [{
    label : 'Courses',
    data : [totalActiveCourses, totalInactiveCourses],
     borderWidth : 1
     }]
 },
 options :{
     responsive:true
 }
    })
}

let totalActiveAdmins = 0
let totalInactiveAdmins = 0
firebase.database().ref("userDetails").on("value", function(snapshot) {
        let total = 0
        snapshot.forEach(function(childSnapshot) {
            let data = childSnapshot.val()
            if (data.Role == "Admin"){
                totalActiveAdmins++;
                    console.log(totalActiveAdmins);
 }else{

      totalInactiveAdmins++;
      console.log(totalInactiveAdmins);
    }
    
    });

  //display total count
   drawHistogram()
})

function drawHistogram() {
    const canvasforhistogram = document.getElementById('myhistogram')
    new Chart(canvasforhistogram, {
type : 'pie',
data: {
    labels : ['Active Admins', 'Inactive Admins'],
    datasets : [{
    label : 'Lecturers',
    data : [totalActiveAdmins, totalInactiveAdmins],
     borderWidth : 1
     }]
 },
 options :{
     responsive:true
 }
    })
}

  

