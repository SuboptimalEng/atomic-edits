# 🎬 AtomicEdits

## Disclaimer

- I've shelved this project (for now) and am currently working on [gamedex](https://github.com/SuboptimalEng/gamedex)
- Follow me on [Twitter](https://twitter.com/SuboptimalEng) for more updates and dank memes 👀

## Image (for those who just want a quick glimpse)

<img src="/demo/atomic_edits.png" width="600">

## Video Demos

- [1 Minute Demo - Original Reddit Post](https://www.reddit.com/r/webdev/comments/ohbl6i/i_made_a_desktop_app_that_automatically_detects/)
- [8 Minute Explanation - YouTube Video](https://www.youtube.com/watch?v=8N5SWcf3DYg&t=89s)

## Project Setup

- If you have a Mac, you can download the [DMG File](https://github.com/SuboptimalEng/AtomicEdits/tree/master/downloads)
- You can also run the the project via NPM:
```
npm install
npm run electron:serve
```

## Helpful Resources
- [Vue + Electron Setup Guide on Medium](https://medium.com/swlh/how-to-safely-set-up-an-electron-app-with-vue-and-webpack-556fb491b83)

## Why Make AtomicEdits?

In 2020, I quit my tech job to pursue creating content on [YouTube](youtube.com/SuboptimalEng) full-time.
The biggest problem I had with making videos was editing/removing silence from them.
(For reference, it takes 1-2 hours to edit 10 minutes of video.) I put aside 2-3 weeks in June to learn video
editing technologies (WaveSurfer.js + FFmpeg) and make a proof of concept - this is the result.
It's really rough around the edges, but saves me some time while editing.

## Main Features

- Automatically detect silence in the video
- Generate silent regions based on length and loudness
- Remove detected silent regions on export
- Add/remove padding to silent regions

## Tech Stack

- Vue/Vuex
- Font Awesome (icons)
- Tailwind CSS (core UI)
- Electron.js (desktop app)
- WaveSurfer.js (audio wave display)
- Fluent FFmpeg (export edited video)
- Hotkeys (keyboard shortcuts)
