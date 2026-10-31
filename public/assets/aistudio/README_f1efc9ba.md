# Bot para Windows

Este é um projeto Electron que cria um aplicativo desktop chamado **Bot** e consulta dados econômicos pela API pública do Banco Central do Brasil (SGS).

## Requisitos para gerar o instalador `.exe`
- Windows 10/11
- Node.js LTS (inclui npm)
- Internet

## Como gerar o executável no Windows
1. Extraia esta pasta no Windows.
2. Abra o Prompt de Comando ou PowerShell dentro da pasta `Bot_Windows`.
3. Execute:
   ```powershell
   npm install
   npm run dist:win
   ```
4. O instalador será gerado em `dist/Bot-Setup-1.0.0.exe`.
5. Execute o instalador para instalar o Bot.

## Como executar sem criar instalador
```powershell
npm install
npm start
```

## API econômica
O aplicativo consulta o endpoint público do Banco Central:
`https://api.bcb.gov.br/dados/serie/bcdata.sgs.{codigo}/dados/ultimos/1?formato=json`

Séries configuradas no protótipo:
- SGS 1: dólar comercial (venda)
- SGS 433: IPCA mensal
- SGS 432: série de juros (validar definição e unidade antes de uso operacional)

## Observações
- Os dados dependem de internet e disponibilidade da API.
- Esta versão contém um assistente de respostas educativas demonstrativas, não um modelo de IA conectado.
- Não compartilhe senhas, dados bancários ou informações pessoais no chat.
- Antes de uso em produção, validar as séries e adicionar tratamento de erros, política de privacidade e atualização da interface.
