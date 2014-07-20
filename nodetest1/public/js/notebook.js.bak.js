$(document).ready(function() {

	/* Model Components Cache */
	var notes = [];
	var labels = [];

	var editor;
	var activeNote;
	var noteNum = 0;
	var labelNum = 0;

	/* jQuery Components Cache */
	var treeList = $('.tree-list');
	var newLabelButton = $('#new-label');
	var newNoteButton = $('#new-note')
	var newLabelInput = $('#label-title-input');
	var newLabelConfirm = $('#label-title-enter');
	var labelSelect = $('#label-select');
	var noteTitlebar = $('#note-title-input');
	var saveNoteButton = $('#save-note-button');

	/* --------------------------------------------------------------------------------- */
	/* --------------------------------------------------------------------------------- */
	/* --------------------------------------------------------------------------------- */
	/* --------------------------------------------------------------------------------- */

	/* Component constructors */
	var Notebook = function(userno, labels, title) {
		this.userno = userno;
		this.labels = labels || [];
		this.title = title || 'default';
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

	/* --------------------------------------------------------------------------------- */
	/* --------------------------------------------------------------------------------- */
	/* --------------------------------------------------------------------------------- */
	/* --------------------------------------------------------------------------------- */

	/* Private/Helper Functions */
	function addNoteListener(htmlElement, note) {
		htmlElement.on('click', function() {
			saveNoteButton.removeClass('disabled-button');

			editor.deleteText(0, editor.getLength());
			editor.insertText(0, note.content);			
			noteTitlebar.val(note.title);

			activeNote = note;
		});

		// delete on middle click (todo: add icons and change to icon click)
		htmlElement.on('mousedown', function(e) {
			if (e.which === 2 && confirm('Are you sure you want to delete \'' + note.title + '\'?')) {
				removeNote(note.labelno, note.dbno);
			}
		});
	}	

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

	function findLabel(labelno) {
		for (var i = 0; i < labels.length; i++) {
			if (labels[i].dbno === labelno)
				return labels[i];
		}
		return null;
	}

	function findLabelCacheIndex(labelno) {
		for (var i = 0; i < labels.length; i++) {
			if (labels[i].dbno === labelno)
				return i;
		}
		return -1;
	}

	function findNoteCacheIndex(parentLabel, noteno) {
		var notesArray = parentLabel.notes;
		for (var i = 0; i < notesArray.length; i++) {
			if (notesArray[i].dbno === noteno)
				return i;
		}
		return -1;
	}

	function removeNote(labelno, noteno) {
		if (activeNote && activeNote.dbno === noteno)
			return false;	// no support for deleting active note yet
		if (labels.length > 0) {
			var parentLabel = labels[findLabelCacheIndex(labelno)];
			if (parentLabel.notes.length > 0) {
				var noteCacheIndex = findNoteCacheIndex(parentLabel, noteno);
				parentLabel.notes.splice(noteCacheIndex, 1);
			}
		}
		renderNotebook();
		return true;
	}

	function removeLabel(labelno) {
		if (activeNote && activeNote.labelno === labelno)
			return false;	// no support for deleting active label yet
		if (labels.length > 1) {
			var index = findLabelCacheIndex(labelno);
			labels[index].splice(index, 1);
			renderNotebook();
			return true;
		}
		else {
			alert('You should keep at least one label in your notebook.');
			return false;
		}
	}

	/* --------------------------------------------------------------------------------- */
	/* --------------------------------------------------------------------------------- */
	/* --------------------------------------------------------------------------------- */
	/* --------------------------------------------------------------------------------- */

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
	}

	function renderNotebook() {
		// get rid of the old tree / label select
		$('.label').remove();
		labelSelect.children().remove();

		// render the new tree / label selects
		labels.forEach(function(label) {
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
		saveNoteButton.addClass('disabled-button');

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

		// new note
		newNoteButton.on('click', function(e) {
			e.preventDefault();
			saveNoteButton.removeClass('disabled-button');

			var note = new Note(-1, noteNum++, 'Untitled', 'Blank note');
			
			editor.deleteText(0, editor.getLength());
			editor.insertText(0, note.content);
			noteTitlebar.val(note.title);

			activeNote = note;
		});

		// save note
		saveNoteButton.on('click', function(e) {
			e.preventDefault();
			if ($(this).hasClass('disabled-button'))
				return;
			
			activeNote.content = editor.getText();
			activeNote.title = noteTitlebar.val();

			var currentLabelNo = parseInt($('#label-select option:selected').val(), 10); 
			if (activeNote.labelno !== currentLabelNo) {
				var newLabel;
				var oldLabelNum = activeNote.labelno;
				activeNote.labelno = currentLabelNo;

				// insert note into new label
				newLabel = findLabel(currentLabelNo);
				if (newLabel !== null)
					newLabel.notes.push(activeNote);

				// remove note from old label
				if (oldLabelNum !== -1) {
					var labelCacheIndex = findLabelCacheIndex(oldLabelNum);
					//removeNote(oldLabelNum, activeNote.dbno);
					labels[labelCacheIndex].notes.splice(
						findNoteCacheIndex(labels[labelCacheIndex], activeNote.dbno), 1);
				}
			}

			renderNotebook();
		});
	}

	/* --------------------------------------------------------------------------------- */
	/* --------------------------------------------------------------------------------- */
	/* --------------------------------------------------------------------------------- */
	/* --------------------------------------------------------------------------------- */	

	/* Startup function calls */
	quillInit();
	loadNotebook();
	renderNotebook();
	addListeners();
});