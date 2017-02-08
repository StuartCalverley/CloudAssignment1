/**
 * When the application html page is loaded this section of code will run
 * it will then check if the user has gone though the login or signup process
 * if not they will be redirected to the home page.
 * This is my way of doing an authentication process.
 */
$( document ).ready(function() {
	if (typeof(Storage) !== "undefined") {
		console.log(sessionStorage.getItem("permission"));
		if(sessionStorage.getItem("permission") === "loggedIn") {
			console.log("SUCCESS");
		} else {
			window.location.href="/";
		}
	} else {
		console.log("Error");
	}
});