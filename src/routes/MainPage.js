import React, {Component} from 'react';
import MyContainer from '../components/MyContainer';
import getWithHeader from '../helperFunctions/getWithHeader';
import AlbumPlaylistBrowse from '../components/MainPage/AlbumPlaylistBrowse';
import Spinner from '../components/Spinner/Spinner';

class MainPage extends Component {
	state = {
		newReleasesArr: [],
		playlistsArr: [],
		withPreviewArr: [],
		showSpinner: true,
	}

	componentDidMount() {
		if (this.props.token) {
			this.getBrowseData();
		}
	}

	componentDidUpdate(prevProps){
		if(prevProps.token !== this.props.token) {
			this.getBrowseData();
		}
	}

	getBrowseData = () => {
		const newReleasesURL = 'https://api.spotify.com/v1/browse/new-releases';
		const playlistsURL = 'https://api.spotify.com/v1/browse/featured-playlists';
		const withPreviewURL = 'https://api.spotify.com/v1/albums/?ids=0fLhefnjlIV3pGNF9Wo8CD,5ceB3rxgXqIRpsOvVzTG28,5rKFS59ntz44KWVXPIlc3N,7f9KDGqY7X2VLBM5aA66KM';
		const releasesPromise = getWithHeader(newReleasesURL, this.props.token);
		const playlistsPromise = getWithHeader(playlistsURL, this.props.token);
		const withPreviewPromise = getWithHeader(withPreviewURL, this.props.token);
		Promise.all([releasesPromise, playlistsPromise, withPreviewPromise]).then(resArr => {
			const [releasesResponse, playlistsResponse, withPreviewResponse] = resArr;
			let newReleasesArr = releasesResponse.data.albums.items;
			let playlistsArr = playlistsResponse.data.playlists.items;
			let withPreviewArr = withPreviewResponse.data.albums;
			withPreviewArr = withPreviewArr.map(album => ({
				albumPlaylist: {
					title: album.name,
					id: album.id
				},
				artist: {
					name: album.artists[0].name,
					id: album.artists[0].id
				},
				imageURL: album.images[1].url
			}));
			newReleasesArr = newReleasesArr.map(album => ({
				albumPlaylist: {
					title: album.name,
					id: album.id
				},
				artist: {
					name: album.artists[0].name,
					id: album.artists[0].id
				},
				imageURL: album.images[1].url
			}));
			playlistsArr = playlistsArr.map(playlist => ({
				albumPlaylist: {
					title: playlist.name,
					id: playlist.id
				},
				imageURL: playlist.images[0].url
			}));
			this.setState({
				newReleasesArr: newReleasesArr.slice(0, 12),
				playlistsArr: playlistsArr.slice(0, 12),
				withPreviewArr: withPreviewArr,
				showSpinner: false,
			});
		})
		.catch(error => {
			console.log(error);
		});
	}

	render () {
		let content;
		if (this.state.showSpinner) {
			content = <Spinner/>;
		} else {
			content = (
				<React.Fragment>
					<AlbumPlaylistBrowse  caption="New Releases" albumPlaylistArr={this.state.newReleasesArr} type="album" />
					<AlbumPlaylistBrowse caption="Featured Playlists" albumPlaylistArr={this.state.playlistsArr} type="playlist" />
					<AlbumPlaylistBrowse caption="Example Albums With Track Previews" albumPlaylistArr={this.state.withPreviewArr} />
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

export default MainPage;