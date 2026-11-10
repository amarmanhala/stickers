# Cloudflare sticker source files

Place the eight original PNG files in this directory using the filenames from
`data/technologies/cloudflare/manifest.json`, then run:

```sh
npm run seed:r2
```

The PNG files are intentionally ignored by Git. The seed command uploads the
manifest to `technologies/cloudflare/manifest.json` and each image to
`technologies/cloudflare/stickers/<filename>` in the configured R2 bucket.
