import { useQuery } from '@tanstack/react-query';
import { api } from '@/lib/axios';

import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from './ui/select';
import { Skeleton } from './ui/skeleton';

interface Prompt {
  id: string;
  title: string;
  template: string;
}

interface PromptSelectProps {
  onSelectPrompt: (template: string) => void;
}

export function PromptSelect({ onSelectPrompt }: PromptSelectProps) {
  const {
    isLoading,
    error,
    data: prompts,
  } = useQuery<Prompt[]>({
    queryKey: ['prompts'],
    queryFn: () => api.get('/prompts').then(response => response.data),
  });

  if (isLoading || error) {
    if (error) {
      console.error(error);
    }
    return <Skeleton className="h-9 w-full" />;
  }

  const handleSelectPrompt = (promptId: string) => {
    const selectedPrompt = prompts?.find(prompt => prompt.id === promptId);

    if (!selectedPrompt) return;

    onSelectPrompt(selectedPrompt.template);
  };

  return (
    <Select onValueChange={handleSelectPrompt}>
      <SelectTrigger>
        <SelectValue placeholder="Selecione um prompt..." />
      </SelectTrigger>
      <SelectContent>
        {prompts?.map(prompt => (
          <SelectItem key={prompt.id} value={prompt.id}>
            {prompt.title}
          </SelectItem>
        ))}
      </SelectContent>
    </Select>
  );
}
