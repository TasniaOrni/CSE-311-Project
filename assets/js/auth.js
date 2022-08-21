$(document).ready(function () {
	$('.loginBtn').click(function (e) {
		e.preventDefault();

		$('#responseMessage').html('');

		var email = $('#email').val();
		var password = $('#password').val();

		if (email == '' || password == '') {
			$('#responseMessage').html('Please fill all fields');
			$('#responseMessage').css('color', 'red');
			return;
		}

		console.log(email, password);

		// senitize input
		email = email.trim();
		password = password.trim();

		// validate email
		var pattern = /^[a-zA-Z0-9.!#$%&'*+/=?^_`{|}~-]+@[a-zA-Z0-9-]+(?:\.[a-zA-Z0-9-]+)*$/;
		if (!pattern.test(email)) {
			$('#responseMessage').html('Invalid email');
			$('#responseMessage').css('color', 'red');
			return;
		}

		// disable button
		$('.loginBtn').attr('disabled', true);

		var data = {
			email: email,
			password: password,
		};

		// send request to server
		$.ajax({
			type: 'POST',
			url: '/api/auth/login',
			data: data,
			// contentType: 'application/json',

			success: function (response) {
				$('#responseMessage').text(response.message);
				// set token to local storage
				saveResult(response.user, response.token);

				// redirect to user home page
				if (response.user.role === 'applicant') {
					window.location.href = '/applicant';
				} else if (response.user.role === 'recruiter') {
					window.location.href = '/recruiter';
				} else if (response.user.role === 'admin') {
					window.location.href = '/admin';
				}
			},
			error: function (error) {
				console.log(error);
				// enable button
				$('.loginBtn').attr('disabled', false);

				if (error.status === 400) {
					$('#responseMessage').text(error.responseJSON.message);
				} else if (error.status === 403) {
					$('#responseMessage').text(error.responseJSON.message);
				}
			},
		});

		function saveResult(user, token) {
			localStorage.setItem('user', JSON.stringify(user));
			localStorage.setItem('token', token);
		}
	});

	$('.signupBtn').click(function (e) {
		e.preventDefault();
		$('#responseMessage').html('');

		var name = $('#name').val();
		var email = $('#email').val();
		var password = $('#password').val();
		var confirmPassword = $('#confirmPassword').val();

		// get radio button value
		var role = $('input[name=role]:checked').val();

		if (name == '' || email == '' || password == '' || confirmPassword == '' || role == '') {
			$('#responseMessage').html('Please fill all fields');
			$('#responseMessage').css('color', 'red');
			return;
		}

		// senitize input
		name = name.trim();
		email = email.trim();
		password = password.trim();
		confirmPassword = confirmPassword.trim();

		// validate email
		var pattern = /^[a-zA-Z0-9.!#$%&'*+/=?^_`{|}~-]+@[a-zA-Z0-9-]+(?:\.[a-zA-Z0-9-]+)*$/;
		if (!pattern.test(email)) {
			$('#responseMessage').html('Invalid email');
			$('#responseMessage').css('color', 'red');
			return;
		}

		// validate password
		if (password !== confirmPassword) {
			$('#responseMessage').html('Passwords do not match');
			$('#responseMessage').css('color', 'red');
			return;
		}

		// check if password is at least 6 characters long
		if (password.length < 6) {
			$('#responseMessage').html('Password must be at least 6 characters long');
			$('#responseMessage').css('color', 'red');
			return;
		}

		// disable button
		$('.signupBtn').attr('disabled', true);

		var data = {
			name: name,
			email: email,
			password: password,
			role: role,
		};

		// send request to server

		$.ajax({
			type: 'POST',
			url: '/api/auth/signup',
			data: data,
			// contentType: 'application/json',
			success: function (response) {
				$('.signupBtn').attr('disabled', false);

				$('#responseMessage').html(response.message);
				$('#responseMessage').css('color', 'green');
			},
			error: function (error) {
				console.log(error);
				// enable button
				$('.signupBtn').attr('disabled', false);

				if (error.status === 400) {
					$('#responseMessage').html(error.responseJSON.message);
					$('#responseMessage').css('color', 'red');
				} else if (error.status === 403) {
					$('#responseMessage').html(error.responseJSON.message);
					$('#responseMessage').css('color', 'red');

				}
			},
		});
	});
});
