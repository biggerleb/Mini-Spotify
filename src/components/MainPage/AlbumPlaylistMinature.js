import React from 'react';
import Col from 'react-bootstrap/Col';
import colors from '../../colors';
import Radium from 'radium';
import {Link} from 'react-router-dom';

const AlbumPlaylistMinature = (props) => {
	let img; 
	let title;
	let artist = null;

	if (props.artist) {
		img = <Link to={'/album/'+props.albumPlaylist.id}><img src={props.imageURL} alt='album/playlist cover' style={imgStyles} /></Link>
		title = <Link style={titleStyles} to={'/album/'+props.albumPlaylist.id}>{props.albumPlaylist.title}</Link>
		artist = <Link style={artistStyles} to={'/artist/'+props.artist.id}>{props.artist.name}</Link>
	} else {
		img= <Link to={'/playlist/'+props.albumPlaylist.id}><img src={props.imageURL} alt='album/playlist cover' style={imgStyles} /></Link>
		title = <Link style={titleStyles} to={'/playlist/'+props.albumPlaylist.id}>{props.albumPlaylist.title}</Link>
	}

	return (
		<Col xs={6} md={3} style={colStyles}>
			{img}
			{title}
			{artist}
		</Col>
	);
}

const colStyles = {
	display: 'flex',
	justifyContent: 'flex-start',
	alignItems: 'center',
	flexDirection: 'column',
}

const imgStyles = {
	width: '150px',
	height: '150px',
	marginTop: '0.8rem',
	boxShadow: '0px 1px 4px 0px rgba(0,0,0,0.61)',
	'@media (max-width: 576px)': {
		width: '120px',
		height: '120px',
	}
}

const titleStyles = {
	textAlign: 'center',
	color: colors.primaryLink,
	marginTop: '0.3rem',
}

const artistStyles = {
	color: colors.primaryLink,
	fontSize: '0.9rem',
	textAlign: 'center'
}

export default Radium(AlbumPlaylistMinature);