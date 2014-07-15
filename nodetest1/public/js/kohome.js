// Label Constructor
function Label(name, notes) {
	var self = this;

	self.title = name;
	self.notes = ko.observableArray(notes);
}

function Note(name, content, num, parentLabelNo) {
	var self = this;
	
	self.name = name;
	self.content = content;
	self.num = num;
	self.parentLabelNo = parentLabelNo;
}


// Main view model
function NoteBookViewModel() {
	var self = this;

	self.notes = [
		{noteno: 0, parentLabelNo: 0, title: "note1", content: "this is a note"},
		{noteno: 1, parentLabelNo: 0, title: "note2", content: "this is another note"},
		{noteno: 2, parentLabelNo: 1, title: "note3", content: "a note under a different label"}
	];

	var labelsOne = [];
	var labelsTwo = [];

	labelsOne.push(new Note("note1", "text for note 1"));
	labelsOne.push(new Note("note2", "text for note 2"));
	labelsTwo.push(new Note("note3", "text for note 3"));

	self.labels = ko.observableArray([
		new Label("my first label", labelsOne),
		new Label("label num two", labelsTwo)
	]);

	addLabel = function() {
		self.labels.push(new Label("untitled note", []));
	};
}

ko.applyBindings(new NoteBookViewModel());