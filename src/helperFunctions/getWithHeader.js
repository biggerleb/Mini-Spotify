import axios from 'axios';

const getWithHeader = (url, token) => {
	token = 'Bearer ' + token;
	return new Promise((resolve, reject) => {
		axios({
			method: 'get',
			url: url,
			headers: {Authorization: token}
		})
		.then(response => {
			resolve(response);
		})
		.catch(error => {
			reject(error);
			console.log(error);
		});
	});
}

export default getWithHeader;