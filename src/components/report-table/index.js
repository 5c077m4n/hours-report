import React, { Component } from 'react';
import { connect } from 'react-redux';
import PropTypes from 'prop-types';
import uuidv1 from 'uuid';
import ReactTable from 'react-table';
import { InputGroup, Input, InputGroupAddon } from 'reactstrap';
import matchSorter from 'match-sorter';
import 'react-table/react-table.css';
import moment from 'moment';


class ConnectedTable extends Component {
	constructor(props) {
		super(props);
		this.handleChange = this.handleChange.bind(this);
		this.state = {
			reports: this.props.reports,
			month: (this.props.month)? this.props.month : 0,
			year: (this.props.year)? this.props.year : 0
		};
	}

	analyseReports() {
		const users = this.props.reports.reduce((users, rep) => {
			if((
					this.state.month && this.state.year &&
					((moment(rep.date).month() + 1) === this.state.month) &&
					(moment(rep.date).year() === this.state.year)
				)
				|| (
					this.state.month && !this.state.year &&
					((moment(rep.date).month() + 1) === this.state.month)
				)
				|| (
					!this.state.month && this.state.year &&
					(moment(rep.date).year() === this.state.year)
				)
				|| (
					!this.state.month && !this.state.year
				)
			) {
				if(rep.username in users) {
					users[rep.username].totalHours += (rep.end - rep.start);
					users[rep.username].extraHours +=
						((rep.end - rep.start) > 8)?
							(rep.end - rep.start - 8) : 0;
					users[rep.username].workDays++;
				}
				else {
					users[rep.username] = {};
					users[rep.username].id = uuidv1();
					users[rep.username].username = rep.username;
					users[rep.username].totalHours = (rep.end - rep.start);
					users[rep.username].extraHours =
						((rep.end - rep.start) > 8)?
							(rep.end - rep.start - 8) : 0;
					users[rep.username].workDays = 1;
				}
			}
			return users;
		}, {});
		return Object.keys(users).map(user => {
			users[user].avgHoursPerDay =
				users[user].totalHours / users[user].workDays;
			return users[user];
		});
	}

	handleChange(e) {
		e.persist();
		e.preventDefault();
		this.setState({ [e.target.name]: parseInt(e.target.value,  10) });
	}

	render() {
		const data = this.analyseReports();
		const columns = [
			{
				Header: 'Username',
				id: 'username',
				accessor: user => user.username,
				filterMethod: (filter, rows) =>
					matchSorter(rows, filter.value, { keys: ['username'] }),
				filterAll: true
			},
			{ Header: 'Average hours per day', accessor: 'avgHoursPerDay' },
			{ Header: 'Total hours', accessor: 'totalHours' },
			{
				Header: 'Total extra hours (over 8 hours in one day)',
				accessor: 'extraHours'
			}
		];
		const currentYear = moment().year();
		const monthList = Array(12).fill().map((month, i) =>
			(<option key={uuidv1()} value={i + 1}>{i + 1}</option>)
		);
		const yearList = Array(7).fill().map((year, i) =>
			(<option key={uuidv1()} value={currentYear - i}>{currentYear - i}</option>)
		);
		const { month, year } = this.state;

		return (
			<div>
				<InputGroup className="form-group">
					<InputGroupAddon addonType="prepend">Select the month:</InputGroupAddon>
					<Input
						type="select" value={month}
						name="month" onChange={this.handleChange}>
						<option key={uuidv1()} defaultValue value={0}>All Months</option>
						{monthList}
					</Input>
				</InputGroup>
				<InputGroup className="form-group">
					<InputGroupAddon addonType="prepend">Select the year:</InputGroupAddon>
					<Input
						type="select" value={year}
						name="year" onChange={this.handleChange}>
						<option key={uuidv1()} defaultValue value={0}>All Years</option>
						{yearList}
					</Input>
				</InputGroup>

				<ReactTable
					className="-highlight"
					data={data}
					columns={columns}
					resolveData={data => data.map(row => row)}
					showPageJump={false}
					defaultPageSize={5}
					filterable
					defaultFilterMethod={
						(filter, row) => String(row[filter.id]) === filter.value
					}
				/>
			</div>
		);
	}
}
ConnectedTable.propTypes = { reports: PropTypes.array.isRequired };

const mapStateToProps = state => ({
	reports: state.reports,
	month: state.month,
	year: state.year
});
const Table = connect(mapStateToProps)(ConnectedTable);
export default Table;
