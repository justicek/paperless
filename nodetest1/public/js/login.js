$(document).ready(function(e) {
	$('#login-submit').on('click', function() {
		$(this).parents('form').submit();
	});
});