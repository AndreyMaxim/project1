var spotifyApi = null;

Meteor.methods({
	selectPlaylist: function(accessToken) {
		if(!spotifyApi) {
			spotifyApi = new SpotifyWebApi();
		}

		var user 	 = getCurrentLoggedInSpotifyUser(spotifyApi);

		if(checkTokenRefreshed(user, spotifyApi)) {
			user = getCurrentLoggedInSpotifyUser(spotifyApi);
		}
		
		var response = getUserPlaylist(spotifyApi, user.data.body.id);

		return response.data.body;
	}
});

var checkTokenRefreshed = function(response, api) {
  if (response.error && response.error.statusCode === 401) {
  	api.refreshAndUpdateAccessToken();
    return true;
  } else {
    return false;
  }
}

var getPlaylist = function(spotifyApi, keyword)
{	
	// limit: 10, offset: 20 
	return spotifyApi.searchPlaylists(keyword, {});
}

var getUserPlaylist = function(spotifyApi, spotifyId){

	return spotifyApi.getUserPlaylists(spotifyId,{});
}

var getCurrentLoggedInSpotifyUser = function(spotifyApi){
	return spotifyApi.getMe();
}