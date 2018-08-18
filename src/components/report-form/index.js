import React, { Component } from "react";
import { connect } from "react-redux";
import PropTypes from "prop-types";
import moment from 'moment';
import validator from 'validator';
import { InputGroup, InputGroupAddon, Input, Button, Alert } from 'reactstrap';

import { addReport } from "../../redux/actions";
import './index.css';


class ConnectedForm extends Component {
	constructor(props) {
		super(props);
		this.state = { date: moment().format('YYYY-MM-DD'), username: '', start: '0', end: '0' };
		this.handleChange = this.handleChange.bind(this);
		this.handleSubmit = this.handleSubmit.bind(this);
		[
			{"date":"2018-07-25","username":"jack@hotmail.com","start":"08","end":"16"},
			{"date":"2018-07-26","username":"json@gmail.com","start":"09","end":"16"},
			{"date":"2018-07-26","username":"jack@hotmail.com","start":"10","end":"17"},
			{"date":"2018-08-27","username":"jane@gmail.com","start":"08","end":"16"}
		]
			.forEach(item => this.props.addReport(item));

	}

	handleChange(e) {
		this.setState({ [e.target.name]: e.target.value });
	}

	handleSubmit(e) {
		e.preventDefault();
		const { date, username, start, end } = this.state;
		if(
			validator.isNumeric(start) &&
			validator.isNumeric(end) &&
			(0 < parseInt(start, 10) < parseInt(end, 10) < 25) &&
			validator.isEmail(username)
		) {
			this.props.addReport({
				date: moment(date).format('YYYY-MM-DD'),
				username,
				start,
				end
			});
			this.setState({ date: moment().format('YYYY-MM-DD'), username: '', start: '0', end: '0' });
		}
	}

	render() {
		const { date, username, start, end } = this.state;
		return (
			<form onSubmit={this.handleSubmit} className="form-grid">
				<InputGroup className="form-group">
					<InputGroupAddon addonType="prepend">Date:</InputGroupAddon>
					<Input
						type="date" name="date" value={date}
						onChange={this.handleChange}
					/>
				</InputGroup>
				<InputGroup className="form-group">
					<InputGroupAddon addonType="prepend">E-Mail:</InputGroupAddon>
					<Input
						type="email" name="username" value={username}
						onChange={this.handleChange}
					/>
				</InputGroup>
				<InputGroup className="form-group">
					<InputGroupAddon addonType="prepend">Starting Hour:</InputGroupAddon>
					<Input
						type="number" name="start" value={start}
						onChange={this.handleChange} min="0" max="24"
					/>
				</InputGroup>
				<InputGroup className="form-group">
					<InputGroupAddon addonType="prepend">Ending Hour:</InputGroupAddon>
					<Input className="input-field"
						type="number" name="end" value={end}
						onChange={this.handleChange} min="0" max="24"
					/>
				</InputGroup>
				<Button type="submit" color="primary" block>
					SAVE
				</Button>
			</form>
		);
	}
}
ConnectedForm.propTypes = { addReport: PropTypes.func.isRequired };

const mapDispatchToProps = dispatch => ({ addReport: report => dispatch(addReport(report)) });
const Form = connect(undefined, mapDispatchToProps)(ConnectedForm);
export default Form;
