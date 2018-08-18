import { combineReducers } from "redux";

import { ADD_REPORT, REMOVE_REPORT } from "./constants";


const reportReducer = (state = [], action) => {
	switch(action.type) {
		case ADD_REPORT:
			return [...state, action.payload];
		default:
			return state;
	}
};

export default combineReducers({ reports: reportReducer });
