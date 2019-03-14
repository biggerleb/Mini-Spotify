import React, {Component} from 'react';
import colors from '../colors';
import Track from './Track' ;
import {connect} from 'react-redux';
import actionTypes from '../redux/actionTypes';

class TrackList extends Component {
	state = {
		transformedTracks: this.props.tracksArr.map((track, index) => ({
			...track,
			hovered: false,
			trackNumber: index + 1
		}))
	}

	componentDidMount () {
		this.tracksArrToRedux();
	}

	tracksArrToRedux () {
		let tracksForR = this.props.tracksArr.map((track, index) => [index + 1, track.previewURL, track.artists, [track.albumName, track.albumID], track.name]);
		tracksForR = tracksForR.filter(track => track[1]);
		if (tracksForR.length > 0) {
			tracksForR.sort((a,b) => a[0] - b[0]);
		}


		if (this.props.tracksR.length === 0) {
			this.props.dispatchSetArray(tracksForR);
		} else {
			this.props.dispatchSetUpcomingArray(tracksForR);
		}
	}

	componentDidUpdate (prevProps, prevState) {
		if (prevProps.tracksArr !== this.props.tracksArr) {
			const newTransformedTracks = this.props.tracksArr.map((track, index) => ({
				...track,
				trackNumber: index + 1
			}));
			this.setState({
				transformedTracks: newTransformedTracks
			});
		}
		if (prevState.transformedTracks !== this.state.transformedTracks) {
			this.tracksArrToRedux();
		}
	}

	render () {
		return (
			<div style={containerStyles}  className='noselect'>
				{this.state.transformedTracks.map((track, index) => (
					<Track  artists={track.artists}
									duration={track.duration}
									name={track.name}
									previewURL={track.previewURL}
									trackNumber={index + 1}
									key={index + 1}
					 />
				))}
			</div>
		)};
}

const containerStyles = {
	width: '100%',
	borderTop: '1px solid ' + colors.secondary,
}

const mapStateToProps = (state) => ({
	tracksR: state.tracksR,
	upcomingTracksR: state.upcomingTracksR,
});

const mapDispatchToProps = (dispatch) => ({
	dispatchSetArray: (arr) => dispatch({
		type: actionTypes.SET_ARRAY,
		payload: arr
	}),
	dispatchSetUpcomingArray: (arr) => dispatch({
		type: actionTypes.SET_UPCOMING_ARRAY,
		payload: arr
	})
});

export default connect(mapStateToProps, mapDispatchToProps)(TrackList);