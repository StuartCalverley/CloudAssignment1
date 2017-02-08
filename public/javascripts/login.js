$( document ).ready(function(){
	$('#loginAccount').click(function() {
		var name = $('#login-name').val();
		var password = $('#login-pass').val();
		console.log("The name is: "+ name+ " the pass is: "+ password);
		/**
		 * Obtains the email account and password the user entered
		 * checks it against the database to make sure it is a valid user
		 * if so the user will be redirected to the application page
		 */
		$.ajax({
			type: 'GET',
			url: '/loginUser',
			data: {emailAcc: name, pass: password},
			success: function(output){
				if(output == "ERROR") {
					alert("The email does not have an account registered with this service");
				} else if(output == "INVALID") {
					alert("The password you entered is invalid");
				} else {
					//Authorizes the user and stores their username and email on the front end of the website
					sessionStorage.setItem("permission", "loggedIn");
					sessionStorage.setItem("userName", output.userName);
					sessionStorage.setItem("email", output.emailAddress);
					window.location.href="/application";
				}
			}
		});
	});
});