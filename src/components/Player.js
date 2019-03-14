import React, {Component} from 'react';
import colors from '../colors';
import Radium from 'radium';
import {connect} from 'react-redux';
import actionTypes from '../redux/actionTypes';
import {Link} from 'react-router-dom';
import ArtistsDisplay from './ArtistsDisplay';
import {withRouter} from 'react-router';

class Player extends Component {

	componentDidMount () {
		this.playerAudio.volume = 0.1;
		this.playerAudio.addEventListener('ended', () => {
			this.props.changeCurrentR(this.props.tracksR[this.props.trackNumber][1], this.props.trackNumber + 1);
		});
	}
	
	componentDidUpdate (prevProps) {
		if (this.props.current === null && this.props.upcomingTracksR.length > 0) {
			this.props.upcomingToCurrent();
		}
		if (prevProps.current !== this.props.current) {
			this.changeCurrent();
		}
		if ((prevProps.paused !== this.props.paused) || this.props.current) {
			if (this.props.paused) {
				this.playerAudio.pause();
			} else {
				this.playerAudio.play();
			}
		}
	}

	playerAudio = new Audio()

	fromNumToUrl (trNum) {
		return this.props.tracksR[trNum - 1][1];
	}

	playForward () {
		this.props.setPaused(false);
		if (this.props.trackNumber === this.props.tracksR.length) {
			this.props.changeCurrentR(null, null);
		} else {
			this.props.changeCurrentR(this.fromNumToUrl(this.props.trackNumber + 1), this.props.trackNumber + 1);
		}
	}

	playBackwards () {
		this.props.setPaused(false);
		if (this.props.trackNumber === 1 || this.props.trackNumber === null) {
			this.props.changeCurrentR(null, null);
		} else {
			this.props.changeCurrentR(this.fromNumToUrl(this.props.trackNumber - 1), this.props.trackNumber - 1);
		}
	}

	stopPlayHandler = () => {
		console.log(this.props.location.pathname);
		if (this.props.location.pathname === '/' && this.props.current === null) {
			console.log('should stop');
			return null;
		}
		if (this.props.tracksR.length < 1) {
			return null;
		}
		if (this.props.current === null) {
			this.props.changeCurrentR(this.props.tracksR[0][1], 1);
		} else if (!this.props.paused) {
			this.props.togglePaused();
		} else {
			this.props.togglePaused();
		}
	}

	changeCurrent = () => {
		if (this.props.current === null) {
			this.playerAudio.src = "";
		} else {
			this.playerAudio.src = this.props.current;
			this.playerAudio.play();
		}
	}

	render () {
		let iconClasses = 'fas fa-play-circle'
		if (!this.props.paused && this.props.current) {
			iconClasses = 'fas fa-pause-circle';
		}

		let songTitle = null;
		let artistName = null;
		if (this.props.current) {
			const songEl = this.props.tracksR[this.props.trackNumber - 1];
			songTitle = <Link style={linkStyles} to={'/album/' + songEl[3][1]}>{songEl[4]}</Link>;
			artistName = <ArtistsDisplay player artistsArr={this.props.tracksR[this.props.trackNumber - 1][2]} />
		}
		
		return (
			<div style={containerStyles}>
				<div style={songCaptionStyles}>
					{songTitle}
				</div>
				<div style={iDivStyles}>
					<i className="fas fa-step-backward" style={iSmStyles} key="backward" onClick={this.playBackwards.bind(this)}></i>
					<i className={iconClasses} style={iBigStyles}
							onClick={this.stopPlayHandler}
					></i>
					<i className="fas fa-step-forward" style={iSmStyles} key="forward" onClick={this.playForward.bind(this)}></i>
				</div>
				<div style={artistCaptionStyles}>
					{artistName}
				</div>
			</div>
		);
	}
}

const containerStyles = {
	position: 'fixed',
	bottom: '0',
	left: '0',
	width: '100%',
	height: '125px',
	display: 'flex',
	justifyContent: 'center',
	alignItems: 'center',
	backgroundColor: colors.primary,
	color: colors.secondary,
}

const iDivStyles = {
	display: 'flex',
	justifyContent: 'center',
	alignItems: 'center',
}

const iBigStyles = {
	fontSize: '3.5rem',
	marginLeft: '30px',
	marginRight: '30px',
	':hover': {
		transform: 'scale(1.05)',
		cursor: 'pointer'
	},
}

const iSmStyles = {
	fontSize: '1.5rem',
	':hover': {
		transform: 'scale(1.1)',
		cursor: 'pointer'
	}
}

const songCaptionStyles = {
	position: 'absolute',
	top: '6px',
	fontSize: '14px',
	color: colors.light,
	borderLeft: '2px solid ' + colors.light,
	borderRight: '2px solid ' + colors.light,
	padding: '0 0.5rem',

}

const artistCaptionStyles = {
	position: 'absolute',
	bottom: '6px',
	fontSize: '14px',
	color: colors.light,
	padding: '0 0.5rem',
	borderLeft: '2px solid ' + colors.light,
	borderRight: '2px solid ' + colors.light,
}

const linkStyles = {
	color: colors.light,
}

const mapStateToProps = state => ({
	tracksR: state.tracksR,
	upcomingTracksR: state.upcomingTracksR,
	current: state.current,
	paused: state.paused,
	trackNumber: state.currentTNumber
});

const mapDispatchToProps = dispatch => ({
	changeCurrentR: (newURL, newNumber) => dispatch({
		type: actionTypes.CHANGE_CURRENT,
		payload: {
			url: newURL,
			trackNumber: newNumber
		}
	}),
	togglePaused: () => dispatch({
		type: actionTypes.TOGGLE_PAUSED
	}),
	setPaused: (val) => dispatch({
		type: actionTypes.SET_PAUSED,
		payload: val
	}),
	upcomingToCurrent: () => dispatch({
		type: actionTypes.UPCOMING_TO_CURRENT,
	})
});

export default withRouter(connect(mapStateToProps, mapDispatchToProps)(Radium(Player)));