let btnlogin = document.getElementById('btnlogin')
btnlogin.addEventListener("click", () =>{
	let txtusername = document.getElementById('txtusername').value
	let txtpass = document.getElementById('txtpass').value
	btnlogin.innerHTML = "Please wait ..."
	if (txtusername == "" || txtpass == ""){
		alert("Please fill all details.")
		btnlogin.innerHTML = "Log in"
		return
	}

	firebase.auth().setPersistence(firebase.auth.Auth.Persistence.SESSION)
	.then(() =>{
		return firebase.auth().signInWithEmailAndPassword(txtusername, txtpass)
	})
	.then((userCredential) => {
		let emailid = txtusername.replace(/\./g, "_dot_").replace(/@/g, "_at_")
		return firebase.database().ref("userDetails/" + emailid).once("value")
	})
	.then((snapshot) =>{
		const userDetails = snapshot.val()
		if (!userDetails) {
			alert("User profile not found. Please contact your administrator.")
			btnlogin.innerHTML = "Log in"
			return
		}

		const role = userDetails.Role || ""
		const status = (userDetails.Status || "inactive").toLowerCase()

		if (status === "active"){
			if(role === "Admin"){
				window.location.href = "dashboard.html"
			}else if(role === "Student"){
				alert("Student logged in")
			}else{
				alert("No role assigned. Please connect with admin.")
			}
		}else{
			alert("Your account is inactive or blocked. Please contact admin.")
		}
		btnlogin.innerHTML = "Log in"
	})
	.catch((error) =>{
		alert(error.message || "Unable to sign in. Check email and password.")
		btnlogin.innerHTML = "Log in"
	})
})