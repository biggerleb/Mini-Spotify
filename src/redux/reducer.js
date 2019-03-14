import actionTypes from './actionTypes';

const initialState = {
	tracksR: [],
	upcomingTracksR: [],
	current: null,
	paused: false,
	currentTNumber: null
}

function reducer(state = initialState, action) {
	const newState = {...state};

	switch (action.type) {
		
		case actionTypes.SET_ARRAY:
			newState.tracksR = action.payload;
			return newState;

		case actionTypes.SET_UPCOMING_ARRAY:
			newState.upcomingTracksR = action.payload;
			return newState;

		case actionTypes.UPCOMING_TO_CURRENT:
			newState.tracksR = state.upcomingTracksR;
			newState.upcomingTracksR = [];
			return newState;
		
		case actionTypes.CHANGE_CURRENT:
			newState.current = action.payload.url;
			newState.currentTNumber = action.payload.trackNumber;
			return newState;

		case actionTypes.TOGGLE_PAUSED:
			newState.paused = !state.paused;
			return newState;

		case actionTypes.SET_PAUSED:
			newState.paused = action.payload;
			return newState;

		default:
		  return state;
	}
}

export default reducer;