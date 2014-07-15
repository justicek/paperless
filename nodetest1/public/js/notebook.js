/**
	1) load lists from db (mock first)
	2) render on view
	3) attach listeners:
		add new label - produce new label / save to db (mock)
		add new new note - add note to 'no label'
**/
$(document).ready(function() {

	/* Component constructors */
	var Notebook = function(userno, labels) {
		this.userno = userno;
		this.labels = labels || [];
	};

	var Label = function(dbno, title, notes) {
		this.dbno = dbno;
		this.title = title;
		this.notes = notes || [];
	};

	var Note = function(labelno, dbno, title, content) {
		this.labelno = labelno;
		this.dbno = dbno;
		this.title = title;
		this.content = content;
	};

	/* Model Components */
	var notes = [];
	var labels = [];
	var notebook;

	var editor;
	var activeNote;
	var noteNum = 0;
	var labelNum = 0;

	/* jQuery Components */
	var treeList = $('.tree-list');
	var newLabelButton = $('#new-label');
	var newLabelInput = $('#label-title-input');
	var newLabelConfirm = $('#label-title-enter');
	var labelSelect = $('#label-select');
	var noteTitlebar = $('#note-title-input');
	var saveNoteButton = $('#save-note-button');

	/* Private/Helper Functions */
	function makeLabel(label) {
		var listElem = $('<li></li>');
		listElem.text(label.title);
		listElem.addClass('label');
		treeList.append(listElem);

		return listElem;
	}

	function makeNote(parentList, note) {
		var innerListElem = $('<li></li>');
		innerListElem.text(note.title);
		innerListElem.addClass('note');
		addNoteListener(innerListElem, note);
		parentList.append(innerListElem);

		return innerListElem;	
	}

	function makeSelectOption(label) {
		var option = $('<option></option>');
		option.text(label.title);
		option.val(label.dbno);

		return option;
	}

	function addNoteListener(htmlElement, note) {
		htmlElement.on('click', function() {
			editor.deleteText(0, editor.getLength());
			editor.insertText(0, note.content);
			noteTitlebar.val(note.title);
			activeNote = note;
		});
	}	

	/* Initialization Functions */	
	function quillInit() {
		editor = new Quill('#editor', {
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
	  	}});

	  	editor.insertText(0, 'the world is a blank piece of paper', 'italic');
	}

	function loadNotebook() {		
		// todo: replace mock with db calls
		notes.push([new Note(0, noteNum++, 'practice guitar', 'arpeggios, songwriting, improv'),
		 new Note(0, noteNum++, 'build paperless', 'jquery, knockout, etc.'),
		 new Note(0, noteNum++, 'make money', 'research business, budget moeny')]);
		notes.push([new Note(1, noteNum++, 'shopping list', 'cpu, harddrive, cologne')]);

		labels.push(new Label(labelNum++, 'todo', notes[0]));
		labels.push(new Label(labelNum++, 'money', notes[1]));

		notebook = new Notebook(0, labels);
	}

	function renderNotebook() {
		// get rid of the old tree / label select
		$('.label').remove();
		labelSelect.children().remove();

		// render the new tree
		notebook.labels.forEach(function(label) {
			labelSelect.append(makeSelectOption(label));

			var listElem = makeLabel(label);

			if (label.notes.length > 0) {
				var innerList = $('<ul></ul>');
				innerList.addClass('inner-list');

				label.notes.forEach(function(note) {
					makeNote(innerList, note);
				});

				listElem.append(innerList);
			}


		});

		
	}

	function addListeners() {
		// show new label popup
		newLabelButton.on('click', function(e) {
			e.preventDefault();

			$(this).text() === 'new label' ? $(this).text('cancel') : $(this).text('new label');
			$('#label-title-popup').slideToggle();
		});

		// add the new label and hide the popup
		newLabelConfirm.on('click', function(e) {
			e.preventDefault();

			var newLabel = new Label(labelNum++, newLabelInput.val());
			labels.push(newLabel);

			newLabelButton.text('new label');
			newLabelInput.val('');
			$('#label-title-popup').slideToggle();

			renderNotebook();
		});

		// save note
		saveNoteButton.on('click', function(e) {
			e.preventDefault();

			activeNote.content = editor.getText();
			activeNote.title = noteTitlebar.val();

			renderNotebook();
		});
	}	

	/* Start everything up */
	quillInit();
	loadNotebook();
	renderNotebook();
	addListeners();
});