# Gallery — upload & rename guide

Upload images into this folder (`assets/gallery/`) on GitHub, then rename them to match the names below.

## Expected filenames

| Target name        | Used for                          |
|--------------------|-----------------------------------|
| `solar.jpg`        | Hero / default bot pic / **ai**   |
| `portrait.jpg`     | **general** category              |
| `conductor.jpg`    | **tools** category                |
| `wings.jpg`        | **media** category                |
| `throne.jpg`       | **group** category                |
| `roses.jpg`        | **auto** category                 |
| `hood.jpg`         | **anti** category                 |
| `lilies.jpg`       | **owner** category                |
| `rain.jpg`         | Extra (optional custom)           |

## Original → target (if you still have the phone exports)

| Original export   | Rename to         |
|-------------------|-------------------|
| `IMG_7776.jpg`    | `solar.jpg`       |
| `IMG_7554.jpg`    | `portrait.jpg`    |
| `IMG_7536.jpg`    | `conductor.jpg`   |
| `IMG_7539.jpg`    | `wings.jpg`       |
| `IMG_7551.jpg`    | `throne.jpg`      |
| `IMG_7527.jpg`    | `roses.jpg`       |
| `IMG_7529.jpg`    | `hood.jpg`        |
| `IMG_7523.jpg`    | `lilies.jpg`      |
| `IMG_7558.jpg`    | `rain.jpg`        |

## After upload

1. Confirm files live at `assets/gallery/<name>.jpg`
2. Category map is in `data/categoryImages.json`
3. Default bot pic is in `data/menuSettings.json` → `botPicUrl`
4. Or set live with: `.setmenu pic assets/gallery/solar.jpg`

Supported formats: `.jpg` · `.jpeg` · `.png` · `.webp`
