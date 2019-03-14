import React, {Component} from 'react';
import MyContainer from '../components/MyContainer';
import Row from 'react-bootstrap/Row';
import Col from 'react-bootstrap/Col';
import getWithHeader from '../helperFunctions/getWithHeader';
import msToMinSec from '../helperFunctions/msToMinSec';
import TrackList from '../components/TrackList';
import ToggleButtonGroup from 'react-bootstrap/ToggleButtonGroup';
import ToggleButton from 'react-bootstrap/ToggleButton';
import colors from '../colors';
import ArtistAlbums from '../components/ArtistPage/ArtistAlbums';
import Spinner from '../components/Spinner/Spinner';
import Radium from 'radium';

class Artist extends Component {
	
	state = {
		artistName: null,
		imageURL: null,
		showOverview: true,
		popularTracks: [],
		albums: [],
		similarArtist: [],
		singles: [],
		showSpinner: true
	}

	componentDidMount () {
		if (this.props.token) {
			this.getArtistData();
		}
	}

	componentDidUpdate (prevProps) {
		if (prevProps.token !== this.props.token || prevProps.match.params.id !== this.props.match.params.id) {
			this.getArtistData();
			this.setState({
				showOverview: true,
				showSpinner: true,
			});
		}
	}

	getArtistData () {
		const artistMainURL = 'https://api.spotify.com/v1/artists/' + this.props.match.params.id;
		const albumsURL = artistMainURL + '/albums';
		const topTracksURL = artistMainURL + '/top-tracks?country=PL';
		const relatedArtistsURL = artistMainURL + '/related-artists';
		const artistMainPromise = getWithHeader(artistMainURL, this.props.token);
		const albumsPromise = getWithHeader(albumsURL, this.props.token);
		const topTracksPromise = getWithHeader(topTracksURL, this.props.token);
		const relatedArtistsPromise = getWithHeader(relatedArtistsURL, this.props.token);
		Promise.all([artistMainPromise, albumsPromise, topTracksPromise, relatedArtistsPromise]).then(resArr => {
			const artistName = resArr[0].data.name;
			const imageURL = resArr[0].data.images[resArr[0].data.images.length - 2].url;
			const albums = resArr[1].data.items
				.filter(item => item.album_group === 'album')
				.map(albumObj => ({
					albumArtist: {
						id: albumObj.id,
						name: albumObj.name
					},
					imageURL: albumObj.images[albumObj.images.length - 2].url
				}));
			const singles = resArr[1].data.items
				.filter(item => item.album_group === 'single')
				.map(albumObj => ({
					albumArtist: {
						id: albumObj.id,
						name: albumObj.name
					},
					imageURL: albumObj.images[albumObj.images.length - 2].url
				}));
			const popularTracks = resArr[2].data.tracks.slice(0, 5).map(trackObj => ({
				albumID: trackObj.album.id,
				albumName: trackObj.album.name,
				artists: trackObj.artists.map(artist => [artist.name, artist.id]),
				duration: msToMinSec(trackObj.duration_ms),
				name: trackObj.name,
				previewURL: trackObj.preview_url,
				trackNumber: trackObj.track_number
			}));
			const similarArtist = resArr[3].data.artists.slice(0, 12).map(artistObj => ({
				albumArtist: {
					id: artistObj.id,
					name: artistObj.name
				},
				imageURL: artistObj.images[artistObj.images.length - 2].url
			}));
			this.setState({
				artistName: artistName,
				imageURL: imageURL,
				popularTracks: popularTracks,
				albums: albums,
				similarArtist: similarArtist,
				singles: singles,
				showSpinner: false,
			});
		}).catch(err => {
			console.log(err);
		});
	}

	handleButtonOverview = () => {
		this.setState({
			showOverview: true
		});
	}

	handleButtonArtists = () => {
		this.setState({
			showOverview: false
		});
	}

	render () {
		let content;
		let spinnerOrNot;

		

		if (this.state.showOverview) {
			content = (
				<React.Fragment>
				<Row style={rowTopTracksStyles}>
					<h5 style={tracksCaptionStyles}>Most popular tracks</h5>
				</Row>
				<TrackList tracksArr={this.state.popularTracks} />
				<ArtistAlbums type='album' caption="Albums" array={this.state.albums} />
				{ this.state.singles.length > 0 ? <ArtistAlbums type='album' caption="Singles" array={this.state.singles} /> : null }
				</React.Fragment>
			);
		} else {
			content = <ArtistAlbums type='artist' caption="Similar Artists" array={this.state.similarArtist} />
		}

		if (this.state.showSpinner) {
			spinnerOrNot = <Spinner/>
		} else {
			spinnerOrNot = (
				<React.Fragment>
					<Row style={rowDescStyles}>
						<Col xs={12} md={6}>
							<div style={imgDivStyles}>
								<img src={this.state.imageURL} alt="artist" style={imgStyles} />
							</div>
						</Col>
						<Col xs={12} md={6}>
							<div style={descriptionStyles}>
								<p>ARTIST</p>
								<h2 style={artistNameStyles}>{this.state.artistName}</h2>
							</div>
						</Col>
					</Row>
					<Row style={rowButtonStyles}>
						<ToggleButtonGroup type='checkbox' value={this.state.showOverview} onChange={() => null}>
							<ToggleButton variant='secondary' value={true} onClick={this.handleButtonOverview}>Overview</ToggleButton>
	        		<ToggleButton variant='secondary' value={false} onClick={this.handleButtonArtists}>Similar Artists</ToggleButton>
						</ToggleButtonGroup>
					</Row>
					{content}
				</React.Fragment>
			);
		}
		
		return (
			<MyContainer>
				{spinnerOrNot}
			</MyContainer>
		);
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

const imgDivStyles = {
	height: '100%',
	width: '100%',
	display: 'flex',
	'@media (max-width: 768px)': {
		alignItems: 'center',
		justifyContent: 'center',
	}
}

const artistNameStyles = {
	borderRight: '3px solid ' + colors.primary,
	paddingRight: '1rem',
	textAlign: 'right',
	'@media (max-width: 768px)': {
		paddingRight: '0',
		border: 'none',
	}
}

const tracksCaptionStyles = {
	color: colors.secondary
}

const rowDescStyles = {
	paddingBottom: '12px',
	marginLeft: '6px',
	marginRight: '6px',
	justifyContent: 'space-between'
}

const rowButtonStyles = {
	alignItems: 'center',
	justifyContent: 'center',
	margin: '1.2rem 0',
}

const rowTopTracksStyles = {
	alignItems: 'center',
	padding: '0 0.7rem',
	paddingBottom: '0',
	marginRight: '0.7rem',
	marginLeft: '0.7rem',
	marginBottom: '0.5rem'
}

const imgStyles = {
	height: '200px',
	marginLeft: '30px',
	borderRadius: '6px',
	boxShadow: ' 0px 2px 5px 0px rgba(0,0,0,0.75)',
	'@media (max-width: 768px)': {
		marginLeft: '0'
	}
};

export default Radium(Artist);