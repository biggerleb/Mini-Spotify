import React from 'react';
import Radium from 'radium';

const stylesDiv = {
	display: 'flex',
	alignItems: 'center'
}

const stylesI = {
	fontSize: '1.3rem',
	marginRight: '10px'
}

const stylesInput = {
	borderRadius: '10px',
	height: '34px',
	':hover': {
		backgroundColor: '#efefef',
	},
	':focus': {
		backgroundColor: '#efefef',
	}
}

const SearchTabM = (props) => {
	return (
		<div style={stylesDiv}>
			<i className="fas fa-search text-secondary" style={stylesI}></i>
			<form onSubmit={(event) => props.onSubmitHandler(event)} >
				<input type="text" className="form-control" style={stylesInput} placeholder="Song/Album/Artist" maxLength="25"
									onChange={(event) => props.onChangeHandler(event)} 
									value={props.inputVal} />
			</form>
		</div>
	);
}

export default Radium(SearchTabM);