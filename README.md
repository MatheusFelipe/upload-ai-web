# upload-ai-web

Aplicação desenvolvida na NLW IA da [Rocketseat]

## Funcionalidades

- Extrair faixa de áudio MP3 de um arquivo de vídeo MP4
- Gerar a transcrição da faixa de áudio utilizando a API da [OpenAI]
- Seleção de prompt para gerar texto a partir da transcrição (ex.: Sugestões de títulos e descrição do vídeo)

## Ferramentas

- [React] - biblioteca para construção de interfaces reativas
- [Vite] - construção rápida de aplicativos para Web
- [shadcn/ui] - construção de bibliotecas de componentes
- [TailwindCSS] - estilização de componentes
- [Radix UI] - componentes acessíveis
- [Lucide] - pacote de ícones
- [Axios] - cliente HTTP baseado em Promises

## Pré-requisitos

- [Node.js](https://nodejs.org/) v18+
- [pnpm] v8+ (ou outro gerenciador de pacotes à sua escolha)

## Instalação

```sh
pnpm install --frozen-lockfile
```

## Execução

```sh
pnpm run dev
```

Obs.: a API Rest do upload-ai-web, [upload-ai-api], deve estar rodando na porta 3333 da mesma máquina

## Imagens

![Screenshot 2023-09-17 at 19-16-56 upload ai](https://github.com/MatheusFelipe/upload-ai-web/assets/17498338/7d1310c6-f5a1-4c6c-9eb4-c9c4561e54bb)

![2023-09-17-191629_1920x1080_scrot](https://github.com/MatheusFelipe/upload-ai-web/assets/17498338/3d18c7de-9516-41aa-a697-2564c00f9d6e)

[//]: # (These are reference links used in the body of this note and get stripped out when the markdown processor does its job. There is no need to format nicely because it shouldn't be seen. Thanks SO - http://stackoverflow.com/questions/4823468/store-comments-in-markdown-syntax)

   [Rocketseat]: <https://www.rocketseat.com.br/>
   [OpenAI]: <https://openai.com/>
   [React]: <https://react.dev/>
   [Vite]: <https://vitejs.dev/>
   [shadcn/ui]: <https://ui.shadcn.com/>
   [TailwindCSS]: <https://tailwindcss.com/>
   [Radix UI]: <https://www.radix-ui.com/>
   [Lucide]: <https://lucide.dev/guide/packages/lucide-react>
   [Axios]: <https://axios-http.com/ptbr/docs/intro>
   [Node.js]: <https://nodejs.org/>
   [pnpm]: <https://pnpm.io/pt/>
   [upload-ai-api]: <https://github.com/MatheusFelipe/upload-ai-api>
