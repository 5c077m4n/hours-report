import React from "react";
import Table from "../report-table";
import Form from "../report-form";


const Home = () => (
	<div className="row mt-5">
		<div className="col-md-4 offset-md-1">
			<h2>Add a new Record</h2>
			<Form />
		</div>
		<div className="col-md-4 offset-md-1">
			<h2>Records Table</h2>
			<Table />
		</div>
	</div>
);
export default Home;
