import React, {Component} from 'react';
import colors from '../colors';
import ArtistsDisplay from './ArtistsDisplay';
import Radium from 'radium';
import {connect} from 'react-redux';
import actionTypes from '../redux/actionTypes';

class Track extends Component {
	state = {
		hovered: false
	}

	hoveredHandler = (bool) => {
		this.setState({hovered: bool});
	}

	render () {
		const playing = (this.props.previewURL === this.props.currentURL) && !this.props.paused && this.props.previewURL !== null;
		const paused = (this.props.previewURL === this.props.currentURL) && this.props.paused && this.props.previewURL !== null;
		const numberStyles = {
			width: '26px',
			paddingRight: '8px',
			borderRight: '1px solid ' + colors.secondary,
			marginRight: '12px',
		}
		
		var durationVar = this.props.duration;
		var numberContent = this.props.trackNumber;
		if (this.state.hovered && this.props.previewURL) {
			numberContent = <i className="fas fa-play" style={iStylesHov}></i>;
			durationVar = (<React.Fragment>
												<p style = {{display:'inline', margin:'0', color: colors.orange}}>preview</p>
												<p style = {{display:'inline', marginBottom:'0', marginLeft: '10px'}}>0:30</p>
											</React.Fragment>
			);
		}
		if (playing) {
			numberContent = <i className="fas fa-play" style={iStylesAct}></i>;
		}
		if (paused) {
			numberContent = <i className="fas fa-pause" style={iStylesAct}></i>;
		}

		var trackContent;
		if(this.props.previewURL === null && this.state.hovered) {
				trackContent = (
					<div style={trackStyles} onMouseEnter={() => this.hoveredHandler(true)}
																	 onMouseLeave={() => this.hoveredHandler(false)}>
						<div style={numberStyles}>
							<i className="fas fa-stop"></i>
						</div>
						<div>
							{this.props.name}
						</div>
						<div style={artistsStyles} onClick={e => e.stopPropagation()}>
							<ArtistsDisplay artistsArr={this.props.artists} />
						</div>
						<div style={{color: colors.orange, marginLeft:'auto', marginRight: '10px', textAlign: 'center'}}>
							NO PREVIEW URL
						</div>
					</div>
				);
		} else {
				trackContent = (
					<div style={trackStyles} onMouseEnter={() => this.hoveredHandler(true, this.props.trackNumber)}
																	 onMouseLeave={() => this.hoveredHandler(false, this.props.trackNumber)}
																	 onClick={() => onClickHandler(this.props) }>
						<div style={numberStyles}>
							{numberContent}
						</div>
						<div>
							{this.props.name}
						</div>
						<div style={artistsStyles} onClick={e => e.stopPropagation()}>
							<ArtistsDisplay artistsArr={this.props.artists} />
						</div>
						<div style={durationStyle}>
							{durationVar}
						</div>
					</div>
			);
		}

		return trackContent;
	}
}

function onClickHandler(props) {
	if (props.previewURL === props.currentURL) {
		props.togglePaused();
	} else {
		if (props.upcomingTracksR.length > 0) {
			props.upcomingToCurrent();
		}
		let arrToUse = null;
		if (props.upcomingTracksR.length > 0) {
			arrToUse = props.upcomingTracksR;
		} else {
			arrToUse = props.tracksR;
		}
		let trackRNumber = arrToUse.findIndex(el => el[1] === props.previewURL);
		trackRNumber = trackRNumber + 1;
		props.changeCurrentR(props.previewURL, trackRNumber);
		props.setPaused(false);
	}
}

const artistsStyles = {
	fontSize: '0.8rem',
	marginLeft: '12px',
}

const durationStyle = {
	paddingRight: '12px',
	marginLeft: 'auto',
}

const iStylesHov = {
	color: colors.secondray,
}

const iStylesAct = {
	color: colors.orange,
}
const trackStyles = {
	borderBottom: '1px solid ' + colors.secondary,
	display: 'flex',
	justifyContent: 'flex-start',
	alignItems: 'center',
	minHeight: '38px',
	paddingLeft: '8px',
	fontSize: '1.05rem',
	':hover': {
		cursor: 'pointer',
	}
}

const mapStateToProps = state => ({
	currentTNumber: state.currentTNumber,
	paused: state.paused,
	currentURL: state.current,
	upcomingTracksR: state.upcomingTracksR,
	tracksR: state.tracksR,
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
	}),
});

export default connect(mapStateToProps, mapDispatchToProps)(Radium(Track));