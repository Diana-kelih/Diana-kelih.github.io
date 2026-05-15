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
    boarderWidth :1
    }]
},
options :{
    responsive:true,
    scale :{
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

 }else{

      totalInactiveCourses++
    
    }
    });
    
  //display total count
   drawPieChart()
})

function drawPieChart() {
    const canvasforpiegraph = document.getElementById('mypiechart')
    new Chart(canvasforpiechart, {
type : 'pie',
data: {
    labels : ['Active Courses', 'Inactive Courses'],
    datasets : [{
    label : 'Courses',
    data : [totalActiveCourses, totalInactiveCourses],
    boarderWidth :1
    }]
},
options :{
    responsive:true,
    scale :{
        y:{
            beginAtZero:true
        }
    }
}
    
    })
}




