# Mini-Spotify
You can browse artists, search for tracks, check trending playlists, play music etc.

~~Live version is available at https://biggerleb.github.io/mini-spotify-clone/~~ live version stopped working due to problems with authorization to Spotify API (Apr 2023), didn't manage to fix it yet
### Prerequisites for running this app on your local machine
In installation steps I will assume that you have installed NPM
### Installation
Create app with Create React App
```
npx create-react-app mini-spotify
```
In mini-spotify directory delete all files and directories except node-modules directory, then paste there everything from this repository, then run
```
npm install
```
And to run this app on local server run
```
npm start
```
### Built (mainly) with
* React
* Redux
* Spotify Web API
* Bootstrap 4  
### Warning
First boot of this app may take some time because my free heroku server which handles Spotify Web API authentication will need to "wake up"
