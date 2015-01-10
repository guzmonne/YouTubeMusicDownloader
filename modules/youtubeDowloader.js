var youtubeTools = require('./youtubeTools');
var lodash = require('lodash');
var Q = require('q');

function downloadFile(url){
	var deferred = Q.defer();
	var check    = youtubeTools.validYouTubeUrl(url);
	if (check.valid){
		youtubeTools.getVideoInfo(check.vid)
			.then(function(infos){
				var videos = youtubeTools.parseVideoInfo(infos);
				_.each(videos.data, function(video){
					if (video.itag === '140' || video.itag === '141'){
						video.name = videos.name;
						video._id  = check.vid;
						download(video);
					}
				});
			});
		deferred.resolve(check);
	} else {
		deferred.reject(new Error('The url is not valid'));
	}
	return deferred.promise;
}