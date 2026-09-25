# Deploy (obfuscated)

## Local production

```bash
npm install
npm run build          # → dist/ (obfuscated)
npm run start:prod     # node dist/index.js
```

Dev (readable source):

```bash
npm run dev            # nodemon src/index.js
```

## Docker (ships only obfuscated dist/)

```bash
docker compose up -d --build
```

Multi-stage: Stage 1 obfuscates, Stage 2 copies only `dist/` + prod dependencies.

## Notes

- Edit **src/** on GitHub; **servers run dist/**.
- `dist/` is gitignored — do not commit obfuscated output.
- Secrets stay in `.env`.
- Vercel dashboard is separate (`vercel/` folder) and does not need obfuscation.
