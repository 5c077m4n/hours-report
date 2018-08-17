import { combineReducers } from "redux";

import { ADD_REPORT, REMOVE_REPORT } from "./constants";


const reportReducer = (state = [], action) => {
	switch(action.type) {
		case ADD_REPORT:
			return [...state, action.payload];
		case REMOVE_REPORT:
			return state.filter(rec => rec.id !== action.payload.id);
		default:
			return state;
	}
};

export default combineReducers({ reports: reportReducer });
