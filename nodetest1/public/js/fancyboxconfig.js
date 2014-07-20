$(document).ready(function() {
	$('.fancybox').fancybox({
        maxWidth: 800,
        showCloseButton: true
    });

	$('#save-note-button').on('click', function(e) {
		e.preventDefault();
		$.fancybox.open();
	});

	$('#label-select-cancel').on('click', function (e) {
		e.preventDefault();
		e.stopPropogation();
		parent.$.fancybox.close(true);
	});
});