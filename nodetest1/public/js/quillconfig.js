
var editor = new Quill('#editor', {
	modules: {
		"toolbar" : { container : "#quill-toolbar" }
	},
  	styles: {
		'body': {
      		'font-family': "'Arial', san-serif",
      		'color' : '#74c5a3',
      		'background-color': '#555353'},
    	'a': {
      		'text-decoration': 'none' }
  	}
});
