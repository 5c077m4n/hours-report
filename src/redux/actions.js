import { ADD_REPORT, REMOVE_REPORT } from './constants';


export const addReport = report => ({ type: ADD_REPORT,	payload: report });
export const removeReport = report => ({ type: REMOVE_REPORT, payload: report });
