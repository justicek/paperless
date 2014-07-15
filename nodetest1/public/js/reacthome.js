/** @jsx React.DOM */
var NoteList = React.createClass({
	render: function() {
		var createNote = function(noteName) {
			return <li className='note'>{noteName}</li>;
		};

		var mynotes = this.props.notes || ['goodnote'];
		return <ul className='note-list'>{this.props.notes.map(createNote)}</ul>;
	}
});

var LabelList = React.createClass({
	getInitialState: function() {
		return {labels: [], notes: [], noteText: '', labelText: ''};
	},

	onLabelChange: function(e) {
		this.setState({labelText: e.target.value});
	},

	onNoteChange: function(e) {
		this.setState({noteText: e.target.value});
	},

	handleNewLabel: function(e) {
		var labelsUpdated = this.state.labels.concat([this.state.labelText]);
		this.setState({labels: labelsUpdated, labelText: ''});
	},

	handleNewNote: function(e) {
		var notesUpdated = this.state.notes.concat([this.state.noteText]);
		this.setState({notes: notesUpdated, noteText: ''});
	},

	render: function() {
		var createLabel = function(labelName) {
			/* add <NoteList notes=... /> to return statement? */
			return (
				<li className='label'>{labelName}</li>
			);
		};

		var mylabels = ['goodlabel'];

		return (
			<div className='controlbox'>
				<div className='creation-area'>
					<input onChange={this.onLabelChange} value={this.state.labelText}/>
					<a onClick={this.handleNewLabel} className='button'>make label</a>

					<br/>

					<input onChange={this.onNoteChange} value={this.state.noteText}/>
					<a onClick={this.handleNewNote} className='button'>make note</a>
				</div>
				<div className='notebook'>
					<ul className='label-list'>{this.props.mylabels.map(createLabel)}</ul>;
				</div>
			</div>
		);
	}
});

React.renderComponent(<LabelList />, document.getElementById('react-content'));