import React from 'react';
import Container from 'react-bootstrap/Container';
import colors from '../colors';

const MyContainer = (props) => {
	return (
		<Container style={containerStyles}>
			{props.children}
		</Container>
	);
}

const containerStyles = {
	paddingTop: '75px',
	backgroundColor: colors.light,
	minHeight: '100%',
	overflow: 'auto',
	paddingBottom: '150px',
}

export default MyContainer;