import React, {Component} from 'react';
import Row from 'react-bootstrap/Row';
import Col from 'react-bootstrap/Col';
import colors from '../../colors';
import Radium from 'radium';
import AlbumPlaylistMinature from './AlbumPlaylistMinature';

class AlbumPlaylistBrowse extends Component {
	state = {
		currentIndex: null,
		browseParts: []
	}

	componentDidMount () {
		if (this.props.albumPlaylistArr.length > 0) {
			this.deconstructToBrowseParts();
		}
	}

	componentDidUpdate (prevProps) {
		if ((this.props.albumPlaylistArr.length > 0) && (prevProps.albumPlaylistArr !== this.props.albumPlaylistArr) ) {
			this.deconstructToBrowseParts();
		}
	}

	deconstructToBrowseParts () {
		const browsePartsArr = [];
		const propsArr = this.props.albumPlaylistArr.slice();
		for (var i = 0; i <= 2; i++) {
			browsePartsArr.push(propsArr.splice(0, 4));
		}
		this.setState({
			browseParts: browsePartsArr,
			currentIndex: 0
		});
	}

	browseLeft = () => {
		if (this.state.currentIndex === null) {
			return null
		}
		if (this.state.currentIndex === 0) {
			this.setState({
				currentIndex: 2
			});
		} else {
			this.setState(prevState => ({
				currentIndex: prevState.currentIndex - 1
			}));
		}
	}

	browseRight = () => {
		if (this.state.currentIndex === null) {
			return null
		}
		if (this.state.currentIndex === 2) {
			this.setState({
				currentIndex: 0
			});
		} else {
			this.setState(prevState => ({
				currentIndex: prevState.currentIndex + 1
			}));
		}
	}

	render () {
		let topRowContent = (
			<React.Fragment>
				<Col>
					<h5 style={h4Styles}>{this.props.caption}</h5>
				</Col>
				<Col style={middleColStyles}>
					<i className="fas fa-arrow-alt-circle-left" style={iStyles} key="left" onClick={this.browseLeft}></i>
					<i className="fas fa-arrow-alt-circle-right" style={iStyles} key="right" onClick={this.browseRight}></i>
				</Col>
				<Col></Col>
			</React.Fragment>
		);
		if (this.props.caption === "Example Albums With Track Previews") {
			topRowContent = (
				<Col>
					<h5 style={h4Styles}>{this.props.caption}</h5>
				</Col>
			);
		}
		return (
			<React.Fragment>
				<Row style={rowTopStyles}>
					{topRowContent}
				</Row>
				<Row style={rowBottomStyles}>
				 { this.state.browseParts[this.state.currentIndex] ? this.state.browseParts[this.state.currentIndex].map(data => <AlbumPlaylistMinature {...data} key={data.imageURL} />) : null }
				</Row>
			</React.Fragment>
		);
	}
}

const rowTopStyles = {
	alignItems: 'center',
	padding: '0 0.7rem',
	borderBottom: '1px solid ' + colors.secondary,
	paddingBottom: '0px',
	margin: '0 0.7rem',
}

const rowBottomStyles = {
	marginBottom: '50px',
	margin: '1.5rem 0.7rem',
	padding: '0 0.7rem',
}

const middleColStyles = {
	display: 'flex',
	justifyContent: 'center',
}

const h4Styles = {
	marginRight: 'auto',
	paddingLeft: '1rem',
	color: colors.secondary,
}

const iStyles = {
	fontSize: '1.3rem',
	margin: '0 0.5rem',
	color: colors.secondary,
	':hover': {
		transform: 'scale(1.1)',
		cursor: 'pointer'
	}
}

export default Radium(AlbumPlaylistBrowse);