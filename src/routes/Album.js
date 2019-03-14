import React, {Component} from 'react';
import MyContainer from '../components/MyContainer';
import Row from 'react-bootstrap/Row';
import Col from 'react-bootstrap/Col';
import getWithHeader from '../helperFunctions/getWithHeader';
import msToMinSec from '../helperFunctions/msToMinSec';
import ArtistsDisplay from '../components/ArtistsDisplay';
import TrackList from '../components/TrackList';
import Spinner from '../components/Spinner/Spinner';
import Radium from 'radium';

class AlbumPlaylist extends Component {
	state = {
		title: null,
		artists: null,
		img: null,
		year: null,
		tracks: [],
		showSpinner: true,
	}

	componentDidMount () {
		if (!this.props.token) {
			return null;
		}
		this.getAlbumData();
	}

	componentDidUpdate (prevProps) {
		if (prevProps.match.params.id !== this.props.match.params.id) {
			this.getAlbumData();
			this.setState({showSpinner: true});
			return null;
		} else if (this.state.title) {
			return null;
		}
		this.getAlbumData();
	}

	getAlbumData () {
		const url = 'https://api.spotify.com/v1/albums/' + this.props.match.params.id;
		const token = this.props.token;
		getWithHeader(url, token)
			.then(data => {
				data = data.data;
				this.setState({
					showSpinner: false,
					title: data.name,
					artists: data.artists.map(artist => [artist.name, artist.id]),
					img: data.images[1].url,
					year: data.release_date.slice(0, 4),
					tracks: data.tracks.items.map(trackData => ({
						name: trackData.name,
						duration: msToMinSec(trackData.duration_ms),
						artists: trackData.artists.map(artist => [artist.name, artist.id]),
						previewURL: trackData.preview_url,
						trackNumber: trackData.track_number,
						albumName: this.state.title,
						albumID: this.props.match.params.id
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
			content = <Spinner />;
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
								<div  style={descriptionStyles}>
									<h3>{this.state.title}</h3>
									<h5 style={h5Styles}><ArtistsDisplay artistsArr={this.state.artists} /></h5>
									<p style={pStyles}>{this.state.year}</p>
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

const pStyles = {
	marginBottom: '0',
	marginTop: '0.4rem'
}

const h5Styles = {
	marginTop: '0.5rem'
}

const rowDescStyles = {
	paddingBottom: '12px',
	marginLeft: '6px',
	marginRight: '6px',
	justifyContent: 'space-between',
}

const rowTracksStyles = {
	paddingTop: '1.5rem',
	marginLeft: '16px',
	marginRight: '16px',
}

export default Radium(AlbumPlaylist);