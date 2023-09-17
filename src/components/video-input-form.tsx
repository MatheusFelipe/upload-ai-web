import { ChangeEvent, FormEvent, useMemo, useRef, useState } from 'react';
import { FileVideo, Upload } from 'lucide-react';
import { fetchFile } from '@ffmpeg/util';

import { api } from '@/lib/axios';
import { getFFmpeg } from '@/lib/ffmpeg';

import { Button } from './ui/button';
import { Label } from './ui/label';
import { Separator } from './ui/separator';
import { Textarea } from './ui/textarea';

type Status = 'waiting' | 'converting' | 'uploading' | 'generating' | 'success';

const statusMessages: Record<Status, string> = {
  waiting: 'Carregar vídeo',
  converting: 'Convertendo...',
  uploading: 'Carregando...',
  generating: 'Transcrevendo...',
  success: 'Sucesso!',
};

interface VideoInputFormProps {
  onVideoUploaded: (videoId: string) => void;
}

export function VideoInputForm({ onVideoUploaded }: VideoInputFormProps) {
  const [videoFile, setVideoFile] = useState<File>();
  const [status, setStatus] = useState<Status>('waiting');
  const promptInputRef = useRef<HTMLTextAreaElement>(null);

  const handleSelectFile = (event: ChangeEvent<HTMLInputElement>) => {
    const { files } = event.currentTarget;
    if (!files) return;
    const selectedFile = files[0];
    setVideoFile(selectedFile);
  };

  const previewURL = useMemo(() => {
    if (!videoFile) {
      return null;
    }

    return URL.createObjectURL(videoFile);
  }, [videoFile]);

  const convertVideoToAudio = async (video: File) => {
    console.log('Convert started');

    const ffmpeg = await getFFmpeg();
    const inputFileName = 'input.mp4';
    const outputFileName = 'output.mp3';

    await ffmpeg.writeFile(inputFileName, await fetchFile(video));

    // ffmpeg.on('log', log => console.log(log));

    ffmpeg.on('progress', progress => {
      console.log('Convert progress:', Math.round(progress.progress * 100));
    });

    await ffmpeg.exec(['-i', inputFileName, '-map', '0:a', '-b:a', '20k', '-acodec', 'libmp3lame', outputFileName]);

    const data = await ffmpeg.readFile(outputFileName);

    const audioFileBlob = new Blob([data], { type: 'audio/mpeg' });
    const audioFile = new File([audioFileBlob], 'audio.mp3', {
      type: 'audio/mpeg',
    });

    console.log('Convert finished');

    return audioFile;
  };

  const handleUploadVideo = async (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault();

    if (!videoFile) {
      return;
    }

    setStatus('converting');
    const prompt = promptInputRef.current?.value;
    const audioFile = await convertVideoToAudio(videoFile);

    const data = new FormData();

    data.append('file', audioFile);

    setStatus('uploading');
    const response = await api.post('/videos', data);
    const videoId = response.data.video.id;

    setStatus('generating');
    await api.post(`/videos/${videoId}/transcription`, {
      prompt,
    });
    setStatus('success');

    onVideoUploaded(videoId);
  };

  const loading = status !== 'waiting';

  return (
    <form className="space-y-6" onSubmit={handleUploadVideo}>
      <label
        htmlFor="video"
        className="relative border flex rounded-md aspect-video cursor-pointer border-dashed text-sm flex-col gap-2 items-center justify-center text-muted-foreground hover:bg-primary/5"
      >
        {previewURL ? (
          <video src={previewURL} controls={false} className="pointer-events-none absolut inset-0" />
        ) : (
          <>
            <FileVideo className="w-4 h-4" />
            Selecione um vídeo
          </>
        )}
      </label>

      <input type="file" id="video" accept="video/mp4" className="sr-only" onChange={handleSelectFile} />

      <Separator />

      <div className="space-y-2">
        <Label htmlFor="transcription_prompt">Prompt de transcrição</Label>
        <Textarea
          ref={promptInputRef}
          id="transcription_prompt"
          disabled={loading}
          className="h-20 leading-relaxed resize-none"
          placeholder="Inclua palavras-chave mencionadas no vídeo separadas por vírgula (,)"
        />
      </div>

      <Button
        type="submit"
        className="w-full data-[success=true]:bg-emerald-400"
        disabled={loading}
        data-success={status === 'success'}
      >
        {statusMessages[status]}
        {!loading && <Upload className="w-4 h-4 ml-2" />}
      </Button>
    </form>
  );
}
