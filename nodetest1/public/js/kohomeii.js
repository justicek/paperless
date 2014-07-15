// Label Constructor
function Label(name, notes) {
	var self = this;

	self.title = name;
	self.notes = ko.observableArray(notes);
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

	labelsOne.push(self.notes[0]);
	labelsOne.push(self.notes[1]);
	labelsTwo.push(self.notes[2]);

	self.labels = ko.observableArray([
		new Label("my first label", labelsOne),
		new Label("label num two", labelsTwo)
	]);

	addLabel = function() {
		self.labels.push(new Label("untitled note", []));
	};
}

ko.applyBindings(new NoteBookViewModel());