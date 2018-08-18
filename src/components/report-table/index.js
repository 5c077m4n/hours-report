import React, { Component } from "react";
import { connect } from "react-redux";
import PropTypes from "prop-types";
import uuidv1 from 'uuid';
import ReactTable from "react-table";
import 'react-table/react-table.css';
import matchSorter from 'match-sorter'


class ConnectedTable extends Component {
	constructor(props) {
		super(props);
		this.state = { reports: this.props.reports };
	}

	reportsAnalyser() {
		return this.state.reports.reduce((users, rep) => {
			if(rep.username in users) {
				users[rep.username].totalHours += (rep.end - rep.start);
				users[rep.username].extraHours += ((rep.end - rep.start) > 8)?
					(rep.end - rep.start - 8) : 0;
				users[rep.username].workDays++;
			}
			else {
				users[rep.username] = {};
				users[rep.username].id = uuidv1();
				users[rep.username].username = rep.username;
				users[rep.username].totalHours = (rep.end - rep.start);
				users[rep.username].extraHours = ((rep.end - rep.start) > 8)?
					(rep.end - rep.start - 8) : 0;
				users[rep.username].workDays = 1;
			}
			return users;
		}, {});
	}

	render() {
		const users = this.reportsAnalyser();
		const data = Object.keys(users).map(user => {
			users[user].avgHoursPerDay = users[user].totalHours / users[user].workDays;
			return users[user];
		});
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
			{ Header: 'Total extra hours (over 8 hours in one day)', accessor: 'extraHours' }
		];

		return (
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
				} />
		);
	}
}
ConnectedTable.propTypes = { reports: PropTypes.array.isRequired };

const mapStateToProps = state => ({ reports: state.reports });
const Table = connect(mapStateToProps)(ConnectedTable);
export default Table;
