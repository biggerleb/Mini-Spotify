import React, { Component } from 'react';
import './custom.scss';
import Navbar from 'react-bootstrap/Navbar';
import SearchTabM from './components/SearchTabM';
import Player from './components/Player';
import {Route, Switch, Link} from 'react-router-dom';
import Album from './routes/Album';
import Playlist from './routes/Playlist';
import Artist from './routes/Artist';
import Search from './routes/Search';
import axios from 'axios';
import MainPage from './routes/MainPage';
import {withRouter}  from 'react-router';
import {StyleRoot} from 'radium';
import colors from './colors';

class App extends Component {
  state = {
    spotifyToken: null,
    inputVal: '',
    searchQuery: '',
  }

  componentDidMount () {
    axios({
      method: 'get',
      url: 'https://safe-dusk-91008.herokuapp.com/spotify',
    })
    .then(res => {
      const token = res.data.access_token;
      this.setState({
        spotifyToken: token
      });
    })
    .catch(error => {
      console.log(error);
    });
  }

  componentDidUpdate (prevProps, prevState) {
    if (prevState.searchQuery !== this.state.searchQuery) {
      this.props.history.push('/search/' + this.state.searchQuery);
    } 
  }

  onSubmitHandler = (event) => {
    event.preventDefault();
    this.setState( prevState => ({
      searchQuery: encodeURIComponent(prevState.inputVal),
      inputVal: ''
    }));
  }

  onChangeHandler = (event) => {
    this.setState({inputVal: event.target.value});
  }

  render() {
    let linkBack;
    if (this.props.location.pathname === '/') {
      linkBack = null;
    } else {
      linkBack = (
        <Link to="/" style={linkStyles}>
          <i className="fas fa-home"></i>
        </Link>
      );
    }
    return (
      <StyleRoot style={{height: '100%'}}>
        <Navbar bg="primary" style={{position:'absolute', width:'100%', paddingRight:'3rem'}} className='justify-content-center'>
         {linkBack}
         <SearchTabM onSubmitHandler={this.onSubmitHandler}
                     onChangeHandler={this.onChangeHandler} 
                     inputVal={this.state.inputVal}/>
          
        </Navbar>

        <Switch>
          <Route path="/album/:id" render={(props) => <Album {...props} token={this.state.spotifyToken} />} />
          <Route path="/playlist/:id" render={(props) => <Playlist {...props} token={this.state.spotifyToken} />} />
          <Route path="/artist/:id" render={(props) => <Artist {...props} token={this.state.spotifyToken} />} />
          <Route path="/search/:searchQuery" render={ (props) => <Search {...props} token={this.state.spotifyToken} />} />
          <Route path="/" render={(props) => <MainPage {...props} token={this.state.spotifyToken} />} />
        </Switch>

        <Player />
      </StyleRoot>
    );
  }
}

const linkStyles = {
  position: 'absolute',
  fontSize: '1.5rem',
  left: '9px',
  color: colors.secondary
}

export default withRouter(App);
