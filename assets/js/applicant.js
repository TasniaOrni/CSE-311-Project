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

	// update profile
	$('#editProfileForm').submit(function (e) {
		e.preventDefault();
		// clear previous errors
		$('#message').text('');

		var form = $(this);
		var data = form.serialize();

		var name = $('input[name=name').val();
		var email = $('input[name=email').val();
		var phone = $('input[name=phone').val();
		var address = $('input[name=address').val();
		var birthday = $('input[name=birthday').val();
		var education = $('input[name=education').val();
		var skills = $('input[name=skills').val();
		var currentCompany = $('input[name=currentCompany').val();
		var currentPosition = $('input[name=currentPosition').val();
		var cv = $('input[name=cv').val();
		var status = $('input[name=status').val();
		var country = $('input[name=country').val();
		var region = $('input[name=region').val();

		if (
			name == '' ||
			email == '' ||
			phone == '' ||
			address == '' ||
			birthday == '' ||
			education == '' ||
			skills == '' ||
			cv == '' ||
			status == '' ||
			country == '' ||
			region == ''
		) {
			e.preventDefault();

			$('#message').text('Please fill all fields');
			return;
		}

		$.ajax({
			url: '/applicant/',
			type: 'POST',
			data: data,
			success: function (response) {
				// console.log(response);
				Toast.fire({
					icon: 'success',
					title: response.message,
				}).then(() => {
					window.location.href = '/applicant/profile';
				});
			},
			error: function (error) {
				// console.log(error.responseJSON.message);
				Toast.fire({
					icon: 'error',
					title: error.responseJSON.message,
				});
			},
		});
	});

	$('.apply').click(function (e) {
		e.preventDefault();

		var jobId = $(this).data('index');
		var url = '/application/' + jobId;
		var resId = '#serverResponse' + jobId;

		$.ajax({
			url: url,
			type: 'POST',
			success: function (response) {
				$(resId).text(response.message);

				if (response.redirect) {
					window.location.href = response.redirect;
				}
			},
		});
	});
});
