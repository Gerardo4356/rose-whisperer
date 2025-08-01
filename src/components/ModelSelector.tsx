import { useState } from 'react';
import { Check, ChevronDown, Cpu } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Popover, PopoverContent, PopoverTrigger } from '@/components/ui/popover';
import { Command, CommandEmpty, CommandGroup, CommandItem, CommandList } from '@/components/ui/command';
import { useChat } from '@/hooks/useChat';
import { availableModels, ChatModel } from '@/types/chat';
import { cn } from '@/lib/utils';

export const ModelSelector = () => {
  const { selectedModel, setSelectedModel } = useChat();
  const [open, setOpen] = useState(false);

  const handleSelect = (model: ChatModel) => {
    setSelectedModel(model);
    setOpen(false);
  };

  return (
    <Popover open={open} onOpenChange={setOpen}>
      <PopoverTrigger asChild>
        <Button
          variant="outline"
          role="combobox"
          aria-expanded={open}
          className="justify-between min-w-[200px] bg-chat-input border-border hover:bg-secondary"
        >
          <div className="flex items-center gap-2">
            <Cpu className="w-4 h-4 text-primary" />
            <span className="truncate">{selectedModel.name}</span>
          </div>
          <ChevronDown className="ml-2 h-4 w-4 shrink-0 opacity-50" />
        </Button>
      </PopoverTrigger>
      <PopoverContent className="w-[300px] p-0 bg-popover border-border" align="start">
        <Command className="bg-transparent">
          <CommandList>
            <CommandEmpty>No se encontraron modelos.</CommandEmpty>
            <CommandGroup>
              {availableModels.map((model) => (
                <CommandItem
                  key={model.id}
                  value={model.id}
                  onSelect={() => handleSelect(model)}
                  className="cursor-pointer hover:bg-secondary"
                >
                  <div className="flex items-center gap-3 w-full">
                    <Cpu className="w-4 h-4 text-primary" />
                    <div className="flex-1">
                      <p className="font-medium">{model.name}</p>
                      <p className="text-xs text-muted-foreground">
                        {model.description}
                      </p>
                    </div>
                    <Check
                      className={cn(
                        "ml-auto h-4 w-4",
                        selectedModel.id === model.id ? "opacity-100" : "opacity-0"
                      )}
                    />
                  </div>
                </CommandItem>
              ))}
            </CommandGroup>
          </CommandList>
        </Command>
      </PopoverContent>
    </Popover>
  );
};