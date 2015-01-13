/*
 * nodeYouTubeDownloader v0.2
 * https://github.com/kejjang/node-youtube-downloader
 *
 * Copyright (C) 2013 Kej Jang <kejjang@gmail.com>
 * Released under the WTFPL
 * http://www.wtfpl.net/
 *
 * Date: 2013-09-26
 */
var clipboard         = require('copy-paste');
var youtubeDownloader = require('./modules/youtubeDowloader.js');

var clipboardData = null;

process.stdin.resume();
process.stdin.setEncoding('utf-8');

setInterval(function(){
	if (clipboardData !== clipboard.paste()){
		clipboardData = clipboard.paste();
		youtubeDownloader.pushToQueue(clipboardData);
	}
}, 1000);