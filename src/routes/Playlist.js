import React, {Component} from 'react';
import MyContainer from '../components/MyContainer';
import Row from 'react-bootstrap/Row';
import Col from 'react-bootstrap/Col';
import getWithHeader from '../helperFunctions/getWithHeader';
import msToMinSec from '../helperFunctions/msToMinSec';
import TrackList from '../components/TrackList';
import Spinner from '../components/Spinner/Spinner';
import Radium from 'radium';

class AlbumPlaylist extends Component {
	state = {
		title: null,
		img: null,
		tracks: [],
		showSpinner: true,
	}

	componentDidMount () {
		if (!this.props.token) {
			return null;
		}
		this.getAlbumData();
	}

	componentDidUpdate () {
		if (this.state.title) {
			return null;
		}
		this.getAlbumData();
	}

	getAlbumData () {
		const url = 'https://api.spotify.com/v1/playlists/' + this.props.match.params.id;
		const token = this.props.token;
		getWithHeader(url, token)
			.then(data => {
				data = data.data;
				this.setState({
					showSpinner: false,
					title: data.name,
					img: data.images[0].url,
					tracks: data.tracks.items.map(trackData => ({
						name: trackData.track.name,
						duration: msToMinSec(trackData.track.duration_ms),
						artists: trackData.track.artists.map(artist => [artist.name, artist.id]),
						previewURL: trackData.track.preview_url,
						trackNumber: trackData.track.track_number,
						albumName: trackData.track.album.name,
						albumID: trackData.track.album.id
					}))
				});
			})
			.catch(error => {
				console.log(error);
			});
	}

	render () {
		let content;
		if (this.state.showSpinner) {
			content = <Spinner/>
		} else {
			content = (
				<React.Fragment>
				{this.state.title ? (
					<React.Fragment>
						<Row style={rowDescStyles}>
							<Col xs={12} md={6}>
								<div style={imgDivStyles}>
									<img src={this.state.img} alt="album cover" style={imgStyles} />
								</div>
							</Col>
							<Col xs={12} md={6}>
								<div style={descriptionStyles}>
									<h2 style={h2Styles}>{this.state.title}</h2>
									<p style={pStyles}>PLAYLIST</p>
								</div>
							</Col>
							
						</Row>
						<Row style={rowTracksStyles}>
							<TrackList tracksArr={this.state.tracks}
													albumTitle={this.state.title}
													albumID={this.props.match.params.id}
							 />
						</Row>
					</React.Fragment>
				) : null}
				</React.Fragment>
			);
		}
		return (
			<MyContainer>
				{content}
			</MyContainer>
		);
	}
		
}

const imgStyles = {
	height: '200px',
	width: '200px',
	marginLeft: '30px',
	boxShadow: ' 0px 2px 5px 0px rgba(0,0,0,0.75)',
	'@media (max-width: 768px)': {
		marginLeft: '0'
	}
};

const imgDivStyles = {
	height: '100%',
	width: '100%',
	display: 'flex',
	'@media (max-width: 768px)': {
		alignItems: 'center',
		justifyContent: 'center',
	}
}

const h2Styles = {
	textAlign: 'right',
}

const pStyles = {
	marginBottom: '0',
}

const descriptionStyles = {
	width: '100%',
	height: '100%',
	display: 'flex',
	paddingRight: '1.5rem',
	paddingTop: '0.7rem',
	flexDirection: 'column',
	justifyContent: 'flex-end',
	alignItems: 'flex-end',
	'@media (max-width: 768px)': {
		alignItems: 'center',
		justifyContent: 'center',
		paddingRight: '0'
	}
}

const rowDescStyles = {
	paddingBottom: '12px',
	marginLeft: '6px',
	marginRight: '6px',
}

const rowTracksStyles = {
	paddingTop: '1.5rem',
	marginLeft: '16px',
	marginRight: '16px',
}

export default Radium(AlbumPlaylist);