import React from 'react';
import Row from 'react-bootstrap/Row';
import Col from 'react-bootstrap/Col';
import colors from '../../colors';
import AlbumArtistMinature from './AlbumArtistMinature';

const ArtistAlbums = props => {
	let topRowContent = (
		<React.Fragment>
			<Col>
				<h5 style={h4Styles}>{props.caption}</h5>
			</Col>
			<Col></Col>
			<Col></Col>
		</React.Fragment>
	);
	if (props.array.length === 0) {
		topRowContent = null;
	}
	const filtredArr = [];
	const nameValidator = new Set();
	props.array.forEach((el) => {
		if (!nameValidator.has(el.albumArtist.name.toLowerCase())) {
			nameValidator.add(el.albumArtist.name.toLowerCase());
			filtredArr.push(el);
		}
	
	});

	return (
		<React.Fragment>
			<Row style={props.array.length > 0 ? rowTopStyles : null}>
				{topRowContent}
			</Row>
			<Row style={rowBottomStyles}>
			 { filtredArr.map(data => <AlbumArtistMinature type={props.type} {...data} key={data.albumArtist.name} />)  }
			</Row>
		</React.Fragment>
	);
}

const rowTopStyles = {
	alignItems: 'center',
	padding: '0 0.7rem',
	borderBottom: '1px solid ' + colors.secondary,
	paddingBottom: '0px',
	marginRight: '0.7rem',
	marginLeft: '0.7rem',
	marginTop: '1.5rem',
}

const rowBottomStyles = {
	marginBottom: '50px',
	margin: '1.5rem 0.7rem',
	padding: '0 0.7rem',
}

const h4Styles = {
	marginRight: 'auto',
	paddingLeft: '1rem',
	color: colors.secondary,
}

export default ArtistAlbums;