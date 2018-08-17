import React, { Component } from "react";
import { connect } from "react-redux";
import PropTypes from "prop-types";
import moment from 'moment';
import validator from 'validator';

import { addReport } from "../../redux/actions";


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
			(start < end) &&
			(start > 0) &&
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
			<form onSubmit={this.handleSubmit}>
				<div className="form-group">
					<label htmlFor="date">Date</label>
					<input
						type="date" className="form-control"
						id="date" name="date" value={date}
						onChange={this.handleChange} />
					<label htmlFor="username">E-Mail</label>
					<input
						type="email" className="form-control"
						id="username" name="username" value={username}
						onChange={this.handleChange} />
					<label htmlFor="start">Starting Hour</label>
					<input
						type="number" className="form-control"
						id="start" name="start" value={start}
						onChange={this.handleChange} />
					<label htmlFor="end">Ending Hour</label>
					<input
						type="number" className="form-control"
						id="end" name="end" value={end}
						onChange={this.handleChange} />
				</div>
				<button type="submit" className="btn btn-success btn-lg">
					SAVE
				</button>
			</form>
		);
	}
}
ConnectedForm.propTypes = { addReport: PropTypes.func.isRequired };

const mapDispatchToProps = dispatch => ({ addReport: report => dispatch(addReport(report)) });
const Form = connect(undefined, mapDispatchToProps)(ConnectedForm);
export default Form;
