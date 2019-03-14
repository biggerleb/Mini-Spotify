import React, {Component} from 'react';
import colors from '../colors';
import MyContainer from '../components/MyContainer';
import getWithHeader from '../helperFunctions/getWithHeader';
import msToMinSec from '../helperFunctions/msToMinSec';
import ToggleButtonGroup from 'react-bootstrap/ToggleButtonGroup';
import ToggleButton from 'react-bootstrap/ToggleButton';
import TrackList from '../components/TrackList';
import Row from 'react-bootstrap/Row';
import ArtistAlbums from '../components/ArtistPage/ArtistAlbums';

class Search extends Component {	

	state = {
		show: 'tracks',
		tracksArr: [],
		artistsArr: [],
		albumsArr: [],
		}

	componentDidMount () {
		if (this.props.token) {
			this.getSearchData();
		}	
	}

	componentDidUpdate (prevProps) {
		if ((prevProps.match.params.searchQuery !== this.props.match.params.searchQuery) || (prevProps.token !== this.props.token) ) {
			this.getSearchData();			
		}
	}

	getSearchData () {
		const searchURL = 'https://api.spotify.com/v1/search?q=' + this.props.match.params.searchQuery + '&type=track,artist,album&limit=12';
		getWithHeader(searchURL, this.props.token).then(res => {
			const tracksData = res.data.tracks.items;
			const albumsData = res.data.albums.items;
			const artistsData = res.data.artists.items;
			let tracksArr = tracksData.map(track => ({
				albumID: track.album.id,
				albumName: track.album.name,
				artists: track.artists.map(artist => [artist.name, artist.id]),
				duration: msToMinSec(track.duration_ms),
				name: track.name,
				previewURL: track.preview_url,
				trackNumber: track.track_number,
			}));
			const validatorSet = new Set();
			const reducedArr = [];
			for (var i = 0; i < tracksArr.length; i++) {
				if (!validatorSet.has(tracksArr[i].previewURL)) {
					validatorSet.add(tracksArr[i].previewURL);
					reducedArr.push(tracksArr[i]);	
				}
			}
			tracksArr = reducedArr;
			const artistsArr = artistsData.map(artist => ({
				albumArtist: {
					id: artist.id,
					name: artist.name
				},
				imageURL: artist.images.length ? artist.images[artist.images.length - 2].url : null
			}));
			const albumsArr = albumsData.map(album => ({
				albumArtist: {
					id: album.id,
					name: album.name,
				},
				imageURL: album.images[album.images.length - 2].url
			}));
			this.setState({
				tracksArr: tracksArr,
				albumsArr: albumsArr,
				artistsArr: artistsArr
			});
		}).catch(err => {
			console.log(err);
		});
	}

	handleButtonTracks = () => {
		this.setState({show: 'tracks'});
	}

	handleButtonAlbums = () => {
		this.setState({show: 'albums'});
	}

	handleButtonArtists = () => {
		this.setState({show: 'artists'});
	}

	render () {
		let content;
		switch (this.state.show) {
			case 'tracks':
				content = (
					<Row style={rowTracksStyles}>	
						<TrackList tracksArr={this.state.tracksArr} />
					</Row>
				);
				break;
			case 'albums':
				content = (
					<ArtistAlbums type="album" caption="Albums" array={this.state.albumsArr} />
				);
				break;
			case 'artists':
				content = (
					<ArtistAlbums type="artist" caption="Artists" array={this.state.artistsArr} />
				);
				break;
			default:
				console.log('deafult in switch in Search.js <<NOT INTENDED>>');
		}

		return (
			<MyContainer>
				<p style={pStyles}>Searching results for <i>{decodeURIComponent(this.props.match.params.searchQuery)}</i></p>
				<Row style={buttonsRow}>
				<ToggleButtonGroup type='checkbox' value={this.state.show} onChange={() => null}>
						<ToggleButton variant='secondary' value='tracks' onClick={this.handleButtonTracks}>Tracks</ToggleButton>
	      		<ToggleButton variant='secondary' value='albums' onClick={this.handleButtonAlbums}>Albums</ToggleButton>
	      		<ToggleButton variant='secondary' value='artists' onClick={this.handleButtonArtists}>Artists</ToggleButton>
	      </ToggleButtonGroup>
	      </Row>
    			{content}
			</MyContainer>
		);
	}
}

const buttonsRow = {
	justifyContent: 'center',
	marginBottom: '2rem',
}

const rowTracksStyles = {
	marginLeft: '16px',
	marginRight: '16px',
}

const pStyles = {
	paddingLeft: '5px',
	borderLeft: '2px solid ' + colors.secondary,
	marginTop: '-15px',
}

export default Search;