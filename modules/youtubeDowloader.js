var youtubeTools = require('./youtubeTools');
var lodash       = require('lodash');
var url          = require('url');
var http         = require('http');
var fs           = require('fs');
var ffmpeg       = require('fluent-ffmpeg');

var queue   = [];
var working = false;
var downloads = [];

function pushToQueue(youtube_url){
	var check    = youtubeTools.validYouTubeUrl(youtube_url);
	
	if (check.valid){
		youtubeTools.getVideoInfo(check.vid)
		.then(function(data){
			if (!data || data.videos.length === 0) return queueManager();
			for(var i = 0; i < data.videos.length; i++){
				var video = data.videos[i];
				if (video.itag === '140' || video.itag === '141'){
					video.name = data.name;
					video._id  = check.vid;
					queueManager(video);
				}
			}
		});
	} else {
		console.log('URL is invalid!!!');
	}
}

function queueManager(video){
	if (working && video) {
		console.log('\n\nVideo ' + video.name + ' has been added to queue');
		return queue.push(video)
	}
	if (queue.length === 0){
		if (video) return download(video);
		return process.stdout.write('\n\nNo more files to download\n');
	} 
	console.log('\n\nDownloading next video');
	return download(nextVideo());
}

function download(video){
	try {
		process.stdout.write('\n\nDownloading ' + video.name + '\n');	
		startDownload(video);
	} catch(err) { console.log(err); }
}

function nextVideo(){
	return queue.splice(0, 1)[0];
}

function startDownload(video){
	var file_url = video.url;
	var file_size;
	var completed;
	
	try{
			var options = {
			host: url.parse(file_url).host,
			port: 80,
			path: url.parse(file_url).path
		};
	} catch (err){
		return console.log('function startDownload error ' + err);
	}

	http.get(options, function(res) {
		if([301, 302, 303, 307].indexOf(res.statusCode) > -1 && res.headers.location){
			startDownload(res.headers.location);
		}else{
			file_size = parseInt(res.headers['content-length'])

			process.stdout.write("file size: " + (Math.round(file_size * 100.0 / (1024 * 1024)) / 100) + "MB.\n");

			var file_name = video._id + '.' + youtubeTools.fmt_str[video.itag].ext;
			var file      = fs.createWriteStream(file_name);

			working = true;

			video.downloaded = 0;
			downloads.push(video);


			res.on('data', function(data) {
				file.write(data);
				completed = parseInt(parseInt(file.bytesWritten) / file_size * 100) + '%'
				process.stdout.clearLine();
				process.stdout.cursorTo(0);
				process.stdout.write('Completed ' + completed);
				video.downloaded = 
			}).on('end', function() {
				file.end();
				process.stdout.clearLine();
				process.stdout.cursorTo(0);
				if (queue.length > 0){
					process.stdout.write("video download complete.\n");
					process.stdout.write("Still "+ queue.length +" files to download\n");
				}
				working = false;
				convertVideo(file_name, video.name);
				queueManager();
			}).on('error', function(err){ console.log(err); });
		}
	});
}

function convertVideo(file_name, result_name){
	var save_location = './Audio/' + result_name + '.mp3';
	ffmpeg(file_name)
		.audioCodec('libmp3lame')
		.audioChannels(2)
		.format('mp3')
		.on('end', function(){
			process.stdout.clearLine();
			process.stdout.cursorTo(0);
			process.stdout.write(result_name + '.mp3 converted successfully');
			fs.unlink(file_name);
		})
		.on('error', function(){
			process.stdout.clearLine();
			process.stdout.cursorTo(0);
			process.stdout.write('Something heppend while converting ' + result_name + '.mp3');
		})
		.on('progress', function(info){
			process.stdout.clearLine();
			process.stdout.cursorTo(0);
			process.stdout.write(result_name + '.mp3 ' + info.percent + '% done...');
		})
		.on('start', function(){
			process.stdout.clearLine();
			process.stdout.cursorTo(0);
			process.stdout.write('Converting video ' + result_name + '.mp3 ');
		})
		.save(save_location);
}

module.exports = {
	pushToQueue: pushToQueue,
}