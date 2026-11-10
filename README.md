# YourCompany — local website source

This is the complete dark website UI, prepared as a standalone Next.js project for local development. It includes six live color palettes, original animated icons, two interactive 3D designs and their fallbacks, responsive layouts, and all 17 page layouts.

## Run on Windows with VS Code

1. Install Node.js **22.13 or newer** if it is not already installed.
2. Extract `digital-company-website-source.zip`.
3. Open the extracted `digital-company-website` folder in VS Code. Open the folder that contains `package.json`.
4. Select **Terminal > New Terminal**.
5. Run:

```powershell
npm install
npm run dev
```

6. Open **http://localhost:3000** in your browser.

Keep the terminal running while using the website. Press **Ctrl+C** to stop it. When you return later, run `npm run dev`; you only need to reinstall packages when dependencies change.

You can also double-click `START_LOCAL.bat` on Windows. It installs dependencies on the first run and starts the development server.

## If PowerShell blocks npm

Use the Windows command wrappers instead:

```powershell
npm.cmd install
npm.cmd run dev
```

Alternatively, choose **Command Prompt** as your VS Code terminal profile.

## If port 3000 is busy

```powershell
npm run dev -- --port 3001
```

Then open **http://localhost:3001**.

## Included pages

| Page                       | Local path                       |
| -------------------------- | -------------------------------- |
| Home                       | `/`                              |
| Expertise overview         | `/services`                      |
| Digital marketing          | `/services/digital-marketing`    |
| Web development            | `/services/web-development`      |
| Web applications           | `/services/web-applications`     |
| Software development       | `/services/software-development` |
| App development            | `/services/app-development`      |
| Studio / about             | `/about`                         |
| Our approach               | `/process`                       |
| Work collection            | `/work`                          |
| Orbit concept              | `/work/orbit`                    |
| Mono concept               | `/work/mono`                     |
| Stride concept             | `/work/stride`                   |
| Onda concept               | `/work/onda`                     |
| Frequently asked questions | `/faq`                           |
| Contact                    | `/contact`                       |
| Custom 404                 | Any unknown path                 |

## Where to edit

| Change                                                          | File                                 |
| --------------------------------------------------------------- | ------------------------------------ |
| Company name, service content, process, projects, FAQs          | `lib/studio-content.ts`              |
| Colours, typography, spacing, responsive styles, CSS animations | `app/globals.css`                    |
| Home page                                                       | `app/page.tsx`                       |
| Shared navigation and footer                                    | `components/studio/site-shell.tsx`   |
| 3D sculpture and fallback behaviour                             | `components/studio/scene.tsx`        |
| New Signal Bloom sculpture and cursor/touch interaction         | `components/studio/signal-bloom.tsx` |
| Palette names, colors, and default palette                      | `lib/palettes.ts`                    |
| Live palette picker                                            | `components/studio/palette-picker.tsx` |
| Animated icon artwork                                          | `components/studio/animated-icon.tsx` |
| Palette, icon animation, and playground styles                  | `app/design-studio.css`              |
| Project visuals and reusable sections                           | `components/studio/ui.tsx`           |
| Contact form and downloadable brief                             | `components/studio/contact-form.tsx` |
| Page titles and default description                             | `app/layout.tsx`                     |
| Browser icon                                                    | `public/favicon.svg`                 |

For example, change the temporary name in `lib/studio-content.ts`:

```ts
export const company = {
  name: "Your New Company Name",
  descriptor: "Digital, done differently.",
};
```

Save your changes; the development server updates automatically.

## Production build on your computer

```powershell
npm run build
npm start
```

Then open **http://localhost:3000**. `npm start` requires a successful build first.

## Type checking

```powershell
npm run typecheck
```

## Choose a color direction

Click **Color studio** in the bottom-right corner of any page. Each option previews its background, buttons, typography accents, icons, and both 3D sculptures. Your choice is remembered in your browser and survives navigation and reloads.

| Palette | Main accent | Second accent | Background |
| --- | --- | --- | --- |
| After Hours | Violet `#BEA5FF` | Mint `#A1E9DD` | `#0B0C10` |
| Blue Current | Cobalt `#79B8FF` | Ice `#84EFF8` | `#080D18` |
| Wild Signal | Emerald `#8BF0BF` | Lime `#D9F58C` | `#07110E` |
| Soft Voltage | Coral `#FFAD92` | Apricot `#FFD78D` | `#140E0E` |
| Golden Hour | Amber `#F5D488` | Periwinkle `#C4C5FB` | `#11100C` |
| Pink Frequency | Rose `#F5A7CF` | Lilac `#B6AFFF` | `#130C14` |

Violet remains the default until you choose a direction. To change the default for new visitors, update `defaultPalette` in `lib/palettes.ts` to `violet`, `cobalt`, `emerald`, `coral`, `amber`, or `rose`. The picker is a design-review control; it can be removed from `site-shell.tsx` when the final brand colors are selected.

## New: warm-white sections and Spark Catch

The services and FAQ sections now use warm-white backgrounds, dark readable text, and darker versions of the selected brand accents. The hero, portfolio, studio content, and 3D artwork retain their dark backgrounds.

**Spark Catch** is a small playable 3D arcade after the services section. It uses CSS perspective and six-sided cubes, so it also works without WebGL.

- Start a 30-second round with **Play a round**. The game never starts automatically.
- Move the cursor, drag horizontally on touch, or focus the board and use Left/Right to move the catcher.
- Catch bright cubes marked with a spark for points. Longer streaks earn up to a 3× multiplier.
- Avoid coral cubes marked with a cross. Catching one costs a life and five points; missing an ordinary spark only resets the streak.
- Pause with the button or Space while the board is focused. Resume keeps the current time and score. The game pauses when the tab is hidden, the browser loses focus, or the board leaves the viewport.
- Rounds end after 30 seconds or three glitches. The result screen shows your score and offers replay.
- Personal best is saved only in the visitor’s browser. No account, server, or tracking service is involved.
- Reduced-motion preferences disable decorative spinning. Essential game movement starts only after the visitor chooses to play.

The rules and scoring simulation are in `lib/spark-game.ts`, the renderer and controls in `components/studio/spark-catch.tsx`, and the new styling in `app/spark-catch.css`.

Run the game-logic checks with:

```powershell
npm.cmd run test:game
```

## Signal Bloom controls

The home page now includes **Signal Bloom** after the work collection. Its nineteen curved metallic petals are generated directly in code, with no downloaded 3D models, textures, or animation clips.

- Move the pointer to attract, scatter, or swirl the petals using the three mode buttons.
- Click or tap the sculpture, or use **Make it bloom**, to send an opening pulse through the petals.
- Drag horizontally to turn the sculpture. On touch screens, vertical page scrolling remains available.
- Keyboard: Tab to the sculpture, use Left/Right to turn, and Enter/Space to bloom. Every action also has a labelled control.
- **Reset** returns it to its initial arrangement.
- Without WebGL2, an interactive CSS 3D version uses the same controls. Both versions respect reduced-motion settings and the footer motion toggle, and pause rendering while off screen.

The existing hero sculpture is retained and also responds to palette changes. The custom line icons animate on hover or keyboard focus in navigation, menus, service rows, process steps, contact choices, buttons, and the footer.

## Features and current scope

- Six dark palettes with a live, keyboard-accessible palette chooser.
- Original motion-ready SVG icons and cursor-reactive Signal Bloom sculpture.
- Interactive Three.js sculpture on WebGL2-capable devices.
- Animated CSS 3D fallback for browsers without WebGL.
- Reduced-motion support and a motion toggle in the footer.
- Responsive navigation, service menu, category filters, FAQ accordions, and interactive service previews.
- Validated contact UI that generates a downloadable project brief.
- Fonts are installed with npm and served locally; no font service is required at runtime.
- No database, API keys, hosting account, or ChatGPT sign-in is needed to run this local version.

The contact form **does not send or store enquiries**. Email delivery or a backend still needs to be connected. Featured projects and their displayed data are labelled design concepts, not client results. Budget options are planning inputs, not service prices.

## What is in this ZIP

Application source, configuration, a dependency lockfile, the favicon, these instructions, and a Windows launcher. `node_modules`, build output, credentials, and hosting-specific runtime files are excluded. `npm install` downloads the required dependencies; use a local server rather than opening a file directly or using VS Code Live Server.

## Connect this folder to your GitHub repository

For a new extracted copy that does not already have Git history, run the following from the folder containing `package.json`:

```powershell
git init
git branch -M main
git remote add origin https://github.com/ankur4777/new-website.git
git add .
git commit -m "Add website with color studio and interactive 3D bloom"
git push -u origin main
```

If you already connected your local folder to the repository, copy the updated source files into that existing folder, then use `git add .`, `git commit`, and `git push`. Do not copy `node_modules` or `.next` between folders. The included `.gitignore` excludes dependencies, build output, local environment files, and TypeScript cache.
