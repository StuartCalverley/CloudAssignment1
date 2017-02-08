$( document ).ready(function(){
	$('#completeSignUp').click(function() {
		var name = $('#SignUp-name').val();
		var email = $('#email-name').val();
		var password = $('#SignUp-pass').val();

		console.log("The username is: "+ name+ " the email is: "+ email+ " the password is: "+ password);

		/**
		 * Creates an account for the user, if the account is valid (email account not in use)
		 * they will be redirected to the application page.
		 */
		$.ajax({
			type: 'GET',
			url: '/registerUser',
			data: {userName:name, emailAcc: email, pass: password},
			success: function(output){
				if(output == "ERROR") {
					alert("The email is already currently in use");
				} else {
					//Authenticates the user and stores the username and their email address on the front-end side of the website					
					sessionStorage.setItem("permission", "loggedIn");
					sessionStorage.setItem("userName", output.userName);
					sessionStorage.setItem("email", output.emailAddress);
					window.location.href="/application";
				}
			}
		});
	});
});