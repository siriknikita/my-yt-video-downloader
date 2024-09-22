import { useState } from 'react';
import axios from 'axios';

type Option = {
    itag: string;
    resolution?: string;
    abr?: string;
};

const VideoDownloader = () => {
  const [url, setUrl] = useState<string>('');
  const [loading, setLoading] = useState(false);
  const [videoOptions, setVideoOptions] = useState<Option[]>([]);
  const [audioOptions, setAudioOptions] = useState<Option[]>([]);

  const fetchDownloadOptions = async () => {
    setLoading(true);
    try {
      const response = await axios.post('http://localhost:5000/download-options', { url });
      setVideoOptions(response.data.video_options);
      setAudioOptions(response.data.audio_options);
      setLoading(false);
    } catch (error) {
      console.error(error);
      setLoading(false);
    }
  };

  const download = async (itag: string, type: string) => {
    const path = prompt('Enter download path:');
    if (path) {
      try {
        await axios.post('http://localhost:5000/download', {
          url,
          stream_type: type,
          resolution: itag,
          path
        });
        alert('Download started');
      } catch (error) {
        console.error('Download failed', error);
      }
    }
  };

  return (
    <div className="p-8 bg-white rounded shadow-md w-full max-w-lg">
      <div className="mb-4">
        <input
          type="text"
          placeholder="Paste YouTube URL"
          value={url}
          onChange={(e) => setUrl(e.target.value)}
          className="input input-bordered w-full"
        />
        <button onClick={fetchDownloadOptions} className="btn btn-primary mt-4 w-full">
          {loading ? <span className="loading loading-spinner"></span> : 'Fetch Download Options'}
        </button>
      </div>

      {videoOptions.length > 0 && (
        <>
          <h2 className="text-xl font-semibold">Available Video Qualities</h2>
          {videoOptions.map((option) => (
            <div key={option.itag} className="flex justify-between items-center">
              <button className="btn btn-secondary" onClick={() => download(option.itag, 'video')}>
                Download {option.resolution}
              </button>
            </div>
          ))}
        </>
      )}

      <hr className="my-4" />

      {audioOptions.length > 0 && (
        <>
          <h2 className="text-xl font-semibold">Available Audio Qualities</h2>
          {audioOptions.map((option) => (
            <div key={option.itag} className="flex justify-between items-center">
              <button className="btn btn-secondary" onClick={() => download(option.itag, 'audio')}>
                Download {option.abr}
              </button>
            </div>
          ))}
        </>
      )}
    </div>
  );
};

export default VideoDownloader;
