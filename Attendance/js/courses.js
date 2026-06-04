let lecturerSelect = document.getElementById('lecturerSelect')
firebase.database().ref("userDetails").once("value", function(snapshot) {
	lecturerSelect.innerHTML = "<option>Select Lecturer </option>"
	snapshot.forEach(function (childSnapshot) {
		let data = childSnapshot.val()
		if(data.Role == "Admin" && data.Status == "active"){
			let option = document.createElement("option")
			option.value = data.Email
			option.textContent = data.FirstName
			lecturerSelect.appendChild(option)
		}
	})
})

// venue

let venueSelect = document.getElementById('venueSelect')
firebase.database().ref("GpsVenus").once("value", function(snapshot) {
	venueSelect.innerHTML = "<option>Select Venue</option>"
	snapshot.forEach(function (childSnapshot) {
		let data = childSnapshot.val()
		if(data.Status == "active"){
			let option = document.createElement("option")
			option.value = data.VenueCode
			option.textContent = data.VenueName
			venueSelect.appendChild(option)
		}
	})
})



/// add new course to firebase

let btnaddcourse = document.getElementById("btnaddcourse");

  // event
  btnaddcourse.addEventListener("click", () => {

    // inputs
    let txtcoursename = document.getElementById("txtcoursename").value.trim();
    let txtcoursecode = document.getElementById("txtcoursecode").value.trim();
    let lecturerSelect = document.getElementById("lecturerSelect").value.trim();
    let lecturername = document.getElementById("lecturerSelect").textContent
    let venueSelect = document.getElementById("venueSelect").value.trim();
    let statusSelect = document.getElementById("statusSelect").value.trim();
    // get create by 
      let user = firebase.auth().currentUser;
      let createdby = user.email;
      let timenow = Date.now(); 

    // validation
    if (txtcoursename == "") {
      alert("Enter course name");
      return;
    }
    // check if venue code is empty the return code stops here
    if (txtcoursecode == "") {
      alert("Enter course code");
      return;
    }
    // check if longitude is empty the return code stops here
    if (lecturerSelect == "Select Lecturer") {
      alert("Select Lecturer");
      return;
    }
    // check if latitude is empty the return code stops here
    if (venueSelect == "Select Venue") {
      alert("Select  Venue");
      return;
    }

    // firebase insert
    firebase.database().ref("Courses/" + txtcoursecode).set({
      CourseName: txtcoursename,
      CourseCode: txtcoursecode,
      Status: statusSelect,
      LecturerEmail: lecturerSelect,
      Lecturername: lecturername,
      Venue: venueSelect,
      CreatedAt: timenow,
      CreatedBy: createdby
    })

    .then(() => {
      alert("Course added successfully");

      // clear inputs
      document.getElementById("txtcoursename").value = "";
      document.getElementById("txtcoursecode").value = "";
    })
    .catch((error) => {
      alert(error.message);
    });
  });

function loadCourses() {
  if (!window.location.href.includes('courses.html')) return;
  let tablebody = document.getElementById('tablebody');
  if (!tablebody) {
    console.error('tablebody element not found');
    return;
  }
  firebase.database().ref("Courses").on("value", (snapshot) => {
    tablebody.innerHTML = "";
    console.log("Loading courses...");
    snapshot.forEach((childSnapshot) => {
      let data = childSnapshot.val();
      let key = childSnapshot.key;
      console.log("Course:", data);
      if (data.Status == "active") {
        tablebody.innerHTML += `
          <tr>
            <td>${data.CourseName || 'N/A'}</td>
            <td>${data.Status}</td>
            <td>
              <button class="btn btnred" onClick="suspendcourse('${key}')">
                Suspend
              </button>
            </td>
          </tr>
        `;
      }
    });
    console.log("Courses loaded");
  });
}

loadCourses();

function loadInactiveCourses() {
  if (!window.location.href.includes('courses.html')) return;
  let tablebodyinactive = document.getElementById('tablebodyinactive');
  if (!tablebodyinactive) {
    console.error('tablebodyinactive element not found');
    return;
  }
  firebase.database().ref("Courses").on("value", (snapshot) => {
    tablebodyinactive.innerHTML = "";
    snapshot.forEach((childSnapshot) => {
      let data = childSnapshot.val();
      let key = childSnapshot.key;
      if (data.Status == "inactive") {
        tablebodyinactive.innerHTML += `
          <tr>
            <td>${data.CourseName || 'N/A'}</td>
            <td>${data.Status}</td>
            <td>
              <button class="btn btngreen" onClick="activatecourse('${key}')">
                Activate
              </button>
            </td>
          </tr>
        `;
      }
    });
  });
}

document.addEventListener('DOMContentLoaded', function() {
  loadCourses();
  loadInactiveCourses();
});
let lbtotalcourses= document.getElementById("lbtotalcourses")
firebase.database ().ref("Courses").once("value",function (snapshot){
    let total= 0
    snapshot.forEach(function(childSnapshot){
        let data = childSnapshot.val()
        if (data.Status == "active")
            total++;
        
    });

    lbtotalcourses.innerHTML = total;
})

let lbactivecourses = document.getElementById("lbactivecourses")
firebase.database ().ref("Courses").once("value",function (snapshot){
    let total= 0
    snapshot.forEach(function(childSnapshot){
        let data = childSnapshot.val()
        if (data.Status == "active" )
            total++;
        
    });

    lbactivecourses.innerHTML = total;
})
let lbactivecourses = document.getElementById("lbactivecourses")
firebase.database ().ref("Courses").once("value",function (snapshot){
    let total= 0
    snapshot.forEach(function(childSnapshot){
        let data = childSnapshot.val()
        if (data.Status == "active" )
            total++;
        
    });

    lbactivecourses.innerHTML = total;
    
})
let lbpastcourses= document.getElementById("lbpastcourses")
firebase.database ().ref("Courses").once("value",function (snapshot){
    let total= 0
    snapshot.forEach(function(childSnapshot){
        let data = childSnapshot.val()
        if (data.Status == "active" )
            total++;
        
    });

    lbpastcourses.innerHTML = total;
})

let lbinsession= document.getElementById("lbinsession")
firebase.database ().ref("Courses").once("value",function (snapshot){
    let total= 0
    snapshot.forEach(function(childSnapshot){
        let data = childSnapshot.val()
        if (data.Status == "active" )
            total++;
        
    });

    lbinsession.innerHTML = total;
})
