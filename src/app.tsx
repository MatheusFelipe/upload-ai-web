import { useState } from 'react';
import { Github, Wand2 } from 'lucide-react';
import { QueryClient, QueryClientProvider } from '@tanstack/react-query';
import { useCompletion } from 'ai/react';

import { Button } from './components/ui/button';
import { Label } from './components/ui/label';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from './components/ui/select';
import { Separator } from './components/ui/separator';
import { Slider } from './components/ui/slider';
import { Textarea } from './components/ui/textarea';
import { Toaster } from '@/components/ui/toaster';

import { PromptSelect } from './components/prompt-select';
import { VideoInputForm } from './components/video-input-form';

const twentyFourHoursInMs = 1000 * 60 * 60 * 24;
const queryClient = new QueryClient({
  defaultOptions: {
    queries: {
      refetchOnWindowFocus: false,
      refetchOnMount: false,
      refetchOnReconnect: false,
      retry: false,
      staleTime: twentyFourHoursInMs,
    },
  },
});
export function App() {
  const [temperature, setTemperature] = useState(0.5);
  const [videoId, setVideoId] = useState<string>();

  const { input, setInput, handleInputChange, handleSubmit, completion, isLoading } = useCompletion({
    api: 'http://localhost:3333/ai/complete',
    body: {
      videoId,
      temperature,
    },
    headers: {
      'Content-Type': 'application/json',
    },
  });

  return (
    <QueryClientProvider client={queryClient}>
      <div className="min-h-screen flex flex-col">
        <header className="px-6 py-3 flex items-center justify-between border-b">
          <h1 className="text-xl font-bold">upload.ai</h1>

          <div className="flex items-center gap-3">
            <span className="text-sm text-muted-foreground">
              Desenvolvido com 💜 no NLW da{' '}
              <a className="underline" href="https://www.rocketseat.com.br/" target="_blank" rel="noopener noreferrer">
                Rocketseat
              </a>
            </span>

            <Separator orientation="vertical" className="h-6" />

            <a href="https://github.com/MatheusFelipe/upload-ai-web" target="_blank" rel="noopener noreferrer">
              <Button variant="outline">
                <Github className="w-4 h-4 mr-2" />
                GitHub
              </Button>
            </a>
          </div>
        </header>

        <main className="flex-1 p-6 flex gap-6">
          <div className="flex flex-col flex-1 gap-4">
            <div className="grid grid-rows-2 gap-4 flex-1">
              <Textarea
                className="resize-none p-4 leading-relaxed"
                placeholder="Inclua o prompt para a IA..."
                value={input}
                onChange={handleInputChange}
              />
              <Textarea
                className="resize-none p-4 leading-relaxed"
                placeholder="Resultado gerado pela IA"
                readOnly
                value={completion}
              />
            </div>

            <p className="text-sm text-muted-foreground">
              Lembre-se: você pode utilizar a variável <code className="text-violet-400">{'{transcription}'}</code> no
              seu prompt para adicionar o conteúdo da transcrição do vídeo selecionado.
            </p>
          </div>

          <aside className="w-80 space-y-6">
            <VideoInputForm onVideoUploaded={setVideoId} />

            <Separator />

            <form onSubmit={handleSubmit} className="space-y-6">
              <div className="space-y-2">
                <Label>Prompt</Label>
                <PromptSelect onSelectPrompt={setInput} />
              </div>

              <div className="space-y-2">
                <Label>Modelo</Label>
                <Select disabled defaultValue="gpt3.5">
                  <SelectTrigger>
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="gpt3.5">GPT 3.5-turbo 16k</SelectItem>
                  </SelectContent>
                </Select>
                <span className="block text-sm text-muted-foreground italic">
                  Você poderá customizar essa opção em breve
                </span>
              </div>

              <Separator />

              <div className="space-y-4">
                <Label>Temperatura</Label>
                <Slider
                  min={0}
                  max={1}
                  step={0.1}
                  value={[temperature]}
                  onValueChange={value => setTemperature(value[0])}
                />
                <div className="flex justify-between gap-2">
                  {[0, 0.3, 0.5, 0.7, 1].map(value => (
                    <Button
                      key={value}
                      type="button"
                      variant={value === temperature ? 'default' : 'outline'}
                      onClick={() => setTemperature(value)}
                    >
                      {value.toFixed(1)}
                    </Button>
                  ))}
                </div>
                <span className="block text-sm text-muted-foreground italic leading-relaxed">
                  Valores mais altos tendem a deixar o resultado mais criativo, porém com possíveis erros.
                </span>
              </div>

              <Separator />

              <Button disabled={isLoading} type="submit" className="w-full">
                Executar
                <Wand2 className="w-4 h-4 ml-2" />
              </Button>
            </form>
          </aside>
        </main>
      </div>
      <Toaster />
    </QueryClientProvider>
  );
}
