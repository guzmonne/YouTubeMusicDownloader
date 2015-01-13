var lodash      = require('lodash');
var Q           = require('q');
var querystring = require('querystring');
var url         = require('url');
var http        = require('http');

var fmt_str = {
	0:   { desc: 'FLV, 320 x 240, Mono 22KHz MP3'        , ext: 'flv' }, // delete ?
	5:   { desc: 'FLV, 400 x 240, Mono 44KHz MP3'        , ext: 'flv' },
	6:   { desc: 'FLV, 480 x 360, Mono 44KHz MP3'        , ext: 'flv' }, // delete ?
	34:  { desc: 'FLV, 640 x 360, Stereo 44KHz AAC'      , ext: 'flv' },
	35:  { desc: 'FLV, 854 x 480, Stereo 44KHz AAC'      , ext: 'flv' },
	13:  { desc: '3GP, 176 x 144, Stereo 8KHz'           , ext: '3gp' }, // delete ?
	17:  { desc: '3GP, 176 x 144, Stereo 44KHz AAC'      , ext: '3gp' },
	36:  { desc: '3GP, 320 x 240, Stereo 44KHz AAC'      , ext: '3gp' },
	18:  { desc: 'MP4, 640 x 360, Stereo 44KHz AAC'      , ext: 'mp4' },
	22:  { desc: 'MP4, 1280 x 720, Stereo 44KHz AAC'     , ext: 'mp4' },
	37:  { desc: 'MP4, 1920 x 1080, Stereo 44KHz AAC'    , ext: 'mp4' },
	38:  { desc: 'MP4, 4096 x 3072, Stereo 44KHz AAC'    , ext: 'mp4' },
	82:  { desc: 'MP4, 640 x 360, Stereo 44KHz AAC'      , ext: 'mp4' },
	83:  { desc: 'MP4, 854 x 240, Stereo 44KHz AAC'      , ext: 'mp4' },
	84:  { desc: 'MP4, 1280 x 720, Stereo 44KHz AAC'     , ext: 'mp4' },
	85:  { desc: 'MP4, 1920 x 520, Stereo 44KHz AAC'     , ext: 'mp4' },
	43:  { desc: 'WebM, 640 x 360, Stereo 44KHz Vorbis'  , ext: 'webm' },
	44:  { desc: 'WebM, 854 x 480, Stereo 44KHz Vorbis'  , ext: 'webm' },
	45:  { desc: 'WebM, 1280 x 720, Stereo 44KHz Vorbis' , ext: 'webm' },
	46:  { desc: 'WebM, 1920 x 540, Stereo 44KHz Vorbis' , ext: 'webm' },
	100: { desc: 'WebM, 640 x 360, Stereo 44KHz Vorbis'  , ext: 'webm' },
	101: { desc: 'WebM, 854 x 480, Stereo 44KHz Vorbis'  , ext: 'webm' },
	102: { desc: 'WebM, 1280 x 720, Stereo 44KHz Vorbis' , ext: 'webm' },
	133: { desc: 'MP4, 426 x 240, Stereo 44KHz AAC'      , ext: 'mp4' },
	134: { desc: 'MP4, 640 x 360, Stereo 44KHz AAC'      , ext: 'mp4' },
	135: { desc: 'MP4, 854 x 480, Stereo 44KHz AAC'      , ext: 'mp4' },
	136: { desc: 'MP4, 1280 x 720, Stereo 44KHz AAC'     , ext: 'mp4' },
	137: { desc: 'MP4, 1920 x 1080, Stereo 44KHz AAC'    , ext: 'mp4' },
	139: { desc: 'M4A, 48 kbit/s audio only'             , ext: 'm4a' },
	140: { desc: 'M4A, 128 kbit/s audio only'            , ext: 'm4a' },
	141: { desc: 'M4A, 256 kbit/s audio only'            , ext: 'm4a' },
	160: { desc: 'MP4, 256 x 144, Stereo 44KHz AAC'      , ext: 'mp4' },
	264: { desc: 'MP4, 1920 x 1080, Stereo 44KHz AAC'    , ext: 'mp4' }  // not sure
};

function validYouTubeUrl(youtube_url){
	var valid    = false;
	var vid      = '';
	var pattern1 = /^https?:\/\/(.*?)?youtube.com/;
	var pattern2 = /^https?:\/\/youtu.be/;

	if(pattern1.test(youtube_url)) {
		if(youtube_url.indexOf('/v/') == -1) {
			var ua = url.parse(youtube_url, true);
			if(ua.query.v != null) {
				vid   = ua.query.v;
				valid = true;
			} else if(ua.query.video_id != null) {
				vid   = ua.query.video_id;
				valid = true;
			}
		} else {
			var url_parts = url.parse(youtube_url).path.split('/v/');
			vid           = url_parts[1];
			valid         = true;
		} 
	} else if(pattern2.test(youtube_url)) {
		vid   = url.parse(youtube_url).pathname.substr(1);
		valid = true;
	}

	return {valid: valid, vid: vid};
};

function getVideoInfo(vid){
	var deferred       = Q.defer();
	var video_info_url = 'http://www.youtube.com/get_video_info?eurl=http://test.localhost.local/&sts=1586&video_id=' + vid;

	var options = {
		host: url.parse(video_info_url).host,
		port: 80,
		path: url.parse(video_info_url).path
	};

	var infos = '';
	
	function resolve(data){ deferred.resolve(data); }

	http.get(options, function(res) {
		res.on('data', function(data) {
			infos += data.toString();
		}).on('end', function() {
			var queries = querystring.parse(infos);
			var fmt_map = queries.adaptive_fmts.split(',');
			if (fmt_map == ''){
				getVideoInfo_alternative(vid).then(resolve);
			} else {
				resolve(parseVideoInfo(infos));
			}
		}).on('error', function(err){
			deferred.reject(err);
		});
	});

	return deferred.promise;
}

function getVideoInfo_alternative(vid){
	var deferred = Q.defer();
	var video_info_url = 'http://www.youtube.com/watch?v=' + vid;
	var options = {
		host: url.parse(video_info_url).host,
		port: 80,
		path: url.parse(video_info_url).path
	};
	var infos = '';

	http.get(options, function(res) {
		res.on('data', function(data) {
			infos += data.toString();
		}).on('end', function() {
			deferred.resolve(parseVideoInfo_alternative(infos));
		}).on('error', function(err){
			deferred.reject(err);
		});;
	});

	return deferred.promise;
};

function parseVideoInfo(infos){
	var ignoreFormats = ['43', '44', '45', '46', '100', '101', '102', '264'];
	var queries       = querystring.parse(infos);
	var fmt_map       = '';
	
	var data        = {
		id    : new Date().getTime(),
		name  : queries.title,
		videos: [],
	};

	try{
		fmt_map = queries.adaptive_fmts.split(',');
	} catch(err) { console.log(err); }

	for(var i in fmt_map){
		fmt_map[i] = querystring.parse(fmt_map[i]);

		if(fmt_str[fmt_map[i].itag] == undefined){
			fmt_str[fmt_map[i].itag] = { desc: '(' + fmt_map[i].type + ')', ext:'' };
		}

		if(ignoreFormats.indexOf(fmt_map[i].itag) == -1){
			data.videos.push({ itag: fmt_map[i].itag, url: fmt_map[i].url + "&signature=" + getSignature(fmt_map[i])});
		}
	}

	return data;
}

function parseVideoInfo_alternative(infos){
	var ignoreFormats = ['43', '44', '45', '46', '100', '101', '102', '264'];
	var regexp_title  = new RegExp("<meta\\sname=\"title\"\\scontent=\"(.*?)\">", "ig");
	var result_title  = regexp_title.exec(infos);

	var url_encoded_fmt_stream_map = '';
	var regexp_fmt_map             = new RegExp("\"adaptive_fmts\":\\s\"(.*?)\"", "ig");
	var result_fmt_map             = regexp_fmt_map.exec(infos);
	var url_encoded_fmt_stream_map = '';

	var data = {
		id    : new Date().getTime(),
		name  : result_title[1],
		videos: []
	}

	try{
		url_encoded_fmt_stream_map = result_fmt_map[1];
	}catch(err){deferred.reject(err);}

	var fmt_map = '';

	try{
		fmt_map = url_encoded_fmt_stream_map.split(',');
	}catch(err){console.log(err);}

	if(fmt_map == ''){
		console.log('Nothing to see here');
	}else{
		for(var i in fmt_map){
			fmt_map[i] = querystring.parse(fmt_map[i].replace(/\\u0026/g, '&'));

			if(fmt_str[fmt_map[i].itag] == undefined){
				fmt_str[fmt_map[i].itag] = { desc: '(' + fmt_map[i].type + ')', ext:'' };
			}

			if(ignoreFormats.indexOf(fmt_map[i].itag) == -1){
				data.videos.push({ itag: fmt_map[i].itag, url: fmt_map[i].url + "&signature=" + getSignature(fmt_map[i])});
			}
		}
	}

	return data;
}

function getSignature(fmt){
	if (fmt.sig != null) return fmt.sig;
	if (fmt.s != null) return alternativeSignatureHandler(fmt.s);
	return '';
}

function alternativeSignatureHandler(){
	var sArray = s.split("");
	var tmpA, tmpB;

	tmpA = sArray[0];
	tmpB = sArray[52];

	sArray[0] = tmpB;
	sArray[52] = tmpA;

	tmpA = sArray[83];
	tmpB = sArray[62];

	sArray[83] = tmpB;
	sArray[62] = tmpA;

	sArray = sArray.slice(3);
	sArray = sArray.reverse();
	sArray = sArray.slice(3);

	return sArray.join("");
}

module.exports = {
	validYouTubeUrl: validYouTubeUrl,
	getVideoInfo   : getVideoInfo,
	fmt_str        : fmt_str,
};