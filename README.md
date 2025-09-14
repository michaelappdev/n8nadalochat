# n8n Chat Wrapper (CDN, Adalo-friendly)

A tiny Railway-deployable service that serves a single HTML page which embeds the `@n8n/chat` widget via CDN and configures it entirely from URL parameters. Great for no-code tools like Adalo.

- Serves `index.html` at `/` via a minimal Node/Express server.
- Use URL params to configure all `createChat()` options.
- Supports JSON and Base64-encoded JSON for complex fields (e.g., `headers`, `metadata`, `i18n`, `initialMessages`).
- CSS theming via query params mapped to widget CSS variables.

## Quick start

### Local

```bash
npm install
npm run dev
# open http://localhost:3000/
```

Example URL (replace your webhook URL):

```
http://localhost:3000/?webhookUrl=https%3A%2F%2Fyourname.app.n8n.cloud%2Fwebhook%2Fabc123&enableStreaming=true&mode=window
```

### Deploy to Railway

1. Create a new Railway project.
2. Connect this repository or upload the folder.
3. Railway will detect Node and run `npm run start` on port provided by `PORT` env.
4. Once deployed, open the service public URL and append your parameters.

No special env vars required.

## URL parameters

- Required
  - `webhookUrl`: The n8n webhook endpoint.

- Optional simple values
  - `target` (default `#n8n-chat`)
  - `mode` (`window` | `fullscreen`, default `window`)
  - `method` (HTTP method for webhook, default `POST`)
  - `chatInputKey` (default `chatInput`)
  - `chatSessionKey` (default `sessionId`)
  - `defaultLanguage` (default `en`)
  - `allowedFilesMimeTypes` (e.g. `image/*,application/pdf`)

- Optional booleans
  - `enableStreaming` (default `false`)
  - `showWelcomeScreen` (default `false`)
  - `loadPreviousSession` (default `true`)
  - `allowFileUploads` (default `false`)

- Optional complex JSON (three ways)
  - `i18n`, `i18nJson`, `i18nB64`
  - `initialMessages`, `initialMessagesJson`, `initialMessagesB64`
  - `metadata`, `metadataJson`, `metadataB64`
  - `headers`, `headersJson`, `headersB64`

  Notes:
  - With `...Json`, pass URL-encoded JSON.
  - With `...B64`, pass Base64 of a JSON string.
  - The wrapper prefers `...B64` > `...Json` > raw `...`.

- CSS variables (theming)
  - Any `cssVar.<name>=<value>` becomes CSS var `--chat--<name>`.
  - Examples:
    - `cssVar.window--width=480px`
    - `cssVar.window--height=680px`
    - `cssVar.toggle--size=72px`
    - `cssVar.color-primary=%23ff006e`

## Examples

- Minimal (non-streaming):

```
https://your-railway-url/?webhookUrl=https%3A%2F%2Fyourname.app.n8n.cloud%2Fwebhook%2Fabc123
```

- Fullscreen + streaming + custom colors:

```
https://your-railway-url/?webhookUrl=https%3A%2F%2Fyourname.app.n8n.cloud%2Fwebhook%2Fabc123&mode=fullscreen&enableStreaming=true&cssVar.window--width=100vw&cssVar.window--height=100vh&cssVar.color-primary=%23e74266
```

- Headers and metadata via Base64 JSON:

```
# headersB64 = base64('{"Authorization":"Bearer xyz","X-App":"Adalo"}')
# metadataB64 = base64('{"userId":"123","plan":"pro"}')
https://your-railway-url/?webhookUrl=https%3A%2F%2Fyourname.app.n8n.cloud%2Fwebhook%2Fabc123&headersB64=eyJBdXRob3JpemF0aW9uIjoiQmVhcmVyIHh5eiIsIlgtQXBwIjoiQWRhbG8ifQ==&metadataB64=eyJ1c2VySWQiOiIxMjMiLCJwbGFuIjoicHJvIn0=
```

- Initial messages and i18n via JSON:

```
https://your-railway-url/?webhookUrl=https%3A%2F%2Fyourname.app.n8n.cloud%2Fwebhook%2Fabc123&initialMessagesJson=%5B%22Hello!%22,%22How%20can%20I%20help%3F%22%5D&i18nJson=%7B%22en%22:%7B%22title%22:%22Hi!%22,%22inputPlaceholder%22:%22Ask%20away...%22%7D%7D
```

- Enable file uploads and restrict MIME types:

```
https://your-railway-url/?webhookUrl=https%3A%2F%2Fyourname.app.n8n.cloud%2Fwebhook%2Fabc123&allowFileUploads=true&allowedFilesMimeTypes=image/*,application/pdf
```

## n8n setup reminders

- In your `Chat Trigger` node:
  - Add your wrapper domain to Allowed Origins (CORS).
  - Enable "Streaming response" if you use `enableStreaming=true`.
- Align `chatInputKey` and `chatSessionKey` with your AI nodes if you changed them.

## Adalo notes

Use a WebView and build the URL with Magic Text to inject user/session info.
If special characters cause issues, prefer Base64 variants (e.g., `metadataB64`).

## License

MIT
