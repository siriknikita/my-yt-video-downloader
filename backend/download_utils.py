from pytube import YouTube

def get_video_streams(url):
    yt = YouTube(url)
    video_streams = yt.streams.filter(progressive=True, file_extension='mp4').order_by('resolution').desc()
    audio_streams = yt.streams.filter(only_audio=True).order_by('abr').desc()

    video_options = [{"resolution": stream.resolution, "itag": stream.itag} for stream in video_streams]
    audio_options = [{"abr": stream.abr, "itag": stream.itag} for stream in audio_streams]

    return video_options, audio_options

def download_stream(url, stream_type, itag, path):
    yt = YouTube(url)
    stream = yt.streams.get_by_itag(itag)
    stream.download(output_path=path)
    return True
