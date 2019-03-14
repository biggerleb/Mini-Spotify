import React from 'react';
import Col from 'react-bootstrap/Col';
import colors from '../../colors';
import Radium from 'radium';
import {Link} from 'react-router-dom';

const AlbumArtistMinature = (props) => {
	let img; 
	let name;
	let path = '/' + props.type + '/';
	if (props.imageURL === null) {
		img = <div style={noImgDivStyles}><i className="fas fa-camera-retro"></i></div>
	} else {
		img= <Link to={path + props.albumArtist.id}><img src={props.imageURL} alt='album/playlist cover' style={imgStyles} /></Link>
	}
	name = <Link style={titleStyles} to={path + props.albumArtist.id}>{props.albumArtist.name}</Link>

	return (
		<Col xs={6} md={3} style={colStyles}>
			{img}
			{name}
		</Col>
	);
}

const colStyles = {
	display: 'flex',
	justifyContent: 'flex-start',
	alignItems: 'center',
	flexDirection: 'column',
	marginBottom: '1.2rem'
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

const noImgDivStyles = {
	display: 'flex',
	justifyContent: 'center',
	alignItems: 'center',
	height: '150px',
	width: '150px',
	fontSize: '96px',
}

export default Radium(AlbumArtistMinature);