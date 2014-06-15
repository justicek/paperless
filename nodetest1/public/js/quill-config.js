
var editor = new Quill('#editor', {
	modules: {
		"toolbar" : { container : "#quill-toolbar" }
	},
  	styles: {
		'body': {
      		'font-family': "'Arial', san-serif",
      		'background-color': 'wheat'},
    	'a': {
      		'text-decoration': 'none' }
  	}
});
