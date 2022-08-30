$(document).ready(function () {
	// toast
	const Toast = Swal.mixin({
		toast: true,
		position: 'top-right',
		iconColor: 'white',
		customClass: {
			popup: 'colored-toast',
		},
		showConfirmButton: false,
		timer: 2000,
		timerProgressBar: false,
		// smooth transaction
		animation: false,
	});

	// Create a job post
	$('#createJobPost').submit(function (e) {
		e.preventDefault();

		var form = $(this);
		// form validation

		// clear previous errors
		$('#message').text('');

		var data = form.serialize();

		$.ajax({
			type: 'POST',
			url: '/jobs/',
			data: data,
			success: function (response) {
				Toast.fire({
					icon: 'success',
					title: response.message,
				}).then(() => {
					window.location.href = '/recruiter/jobs';
				});
			},
			error: function (error) {
				console.log(error.responseJSON.message);
				Toast.fire({
					icon: 'error',
					title: error.responseJSON.message,
				});
			},
		});
	});

	// Update profile
	$('#updateProfile').submit(function (e) {
		var form = $(this);

		$.ajax({
			url: '/recruiter/profile',
			type: 'POST',
			data: form.serialize(),
			success: function (response) {
				// console.log(response);
				Toast.fire({
					icon: 'success',
					title: response.message,
				}).then(() => {
					window.location.href = '/recruiter/';
				});
			},
			error: function (error) {
				console.log(error.responseJSON.message);
				Toast.fire({
					icon: 'error',
					title: error.responseJSON.message,
				});
			},
		});
	});

	$('#editProfileForm').submit(function (e) {
		e.preventDefault();
		
		var form = $(this);

		$.ajax({
			url: '/recruiter/profile/edit',
			type: 'POST',
			data: form.serialize(),
			success: function (response) {
				// console.log(response);
				Toast.fire({
					icon: 'success',
					title: response.message,
				}).then(() => {
					window.location.href = '/recruiter/profile';
				});
			},
			error: function (error) {
				console.log(error.responseJSON.message);
				Toast.fire({
					icon: 'error',
					title: error.responseJSON.message,
				});
			},
		});
	});
});
