var nodeYouTubeDownloader = {
	fmt_str: {
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
	},
};