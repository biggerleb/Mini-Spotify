import React from 'react';
import './Spinner.css';
import colors from '../../colors';

const Spinner = (props) => {
	return (
		<div style={spinnerStyles} className="spinner">
		  <div style={colorStyles} className="bounce1"></div>
		  <div style={colorStyles} className="bounce2"></div>
		  <div style={colorStyles} className="bounce3"></div>
		</div>
	);
}

const spinnerStyles = {
	margin: '30% auto',
}

const colorStyles = {
	backgroundColor: colors.secondary
}

export default Spinner;