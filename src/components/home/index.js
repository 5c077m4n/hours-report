import React from "react";

import Table from "../report-table";
import Form from "../report-form";
import './index.css';


const Home = () => (
	<div className="main-container">
		<div className="record-form">
			<h2>Add a new Record</h2>
			<Form />
		</div>
		<hr />
		<div className="record-table">
			<h2>Records Table</h2>
			<Table />
		</div>
	</div>
);
export default Home;
