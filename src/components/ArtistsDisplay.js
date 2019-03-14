import React from 'react';
import {Link} from 'react-router-dom';
import colors from '../colors';

const ArtistsDisplay = (props) => {
	const toAdd = [];
	let styles = linkStyles;
	if (props.player) {
		styles = inPlayerlinkStyles;
	}
	props.artistsArr.map((artistArr, index) => {
		if(index > 0){
			toAdd.push(', ');
		}
		toAdd.push(<Link style={styles} key={index} to={'/artist/'+artistArr[1]}>{artistArr[0]}</Link>);
		return null;
	});
	
	return (
		<React.Fragment>
			{toAdd}
		</React.Fragment>
	);
}

const linkStyles = {
	color: colors.primaryLink,
}

const inPlayerlinkStyles = {
	color: colors.light
}

export default ArtistsDisplay;