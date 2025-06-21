# 314 Detector

![314 Detector in action](https://raw.githubusercontent.com/TRGRally/314-detector/refs/heads/main/readme-assets/preview.png)

It goes "ding".

## How to install

- Clone the repo
- Go to `chrome://extensions/`
- Enable "Developer mode" by clicking the toggle in the top right corner
- Click "Load unpacked" in the top left corner
- Select the folder containing the repo
- Make sure the extension displays as "Enabled"

## Features

- Highlights the number 314 on web page text
- Optional sound alert when 314 is detected
- Works on both static and dynamic content
- Detects fuzzy 314s containing a non word character between digits (e.g. 3.14, 3-1-4 etc.)

## Limitations

- Can't detect 314 in images or other non-text content
- 314s that span multiple dom elements won't be detected, even if they appear visually connected

## Todo

- Differentiate between true 314s and fuzzy 314s
- Count how many 314s you have seen

*In the mean time, you might want to check out [314 Slots](https://trgrally.github.io/314-slots/)*
