# Video Assets for VideoText Component

## Required Video File
Place your video file here: `seven18-background.mp4`

## Video Specifications
- **Format**: MP4 (H.264 codec recommended)
- **Duration**: 10-30 seconds (will loop automatically)
- **Resolution**: 1920x1080 or higher
- **File Size**: Keep under 10MB for optimal loading
- **Content**: Should be relevant to Seven18NY (bar/lounge atmosphere, drinks, ambiance)

## Recommended Video Content Ideas
- Bar atmosphere with ambient lighting
- Cocktail preparation
- Lounge ambiance
- People enjoying drinks
- Interior shots of the venue
- Abstract liquid/mixing effects

## Fallback Image
The component will use `/images/7-1.jpg` as a fallback if the video fails to load.

## Optimization Tips
1. Compress the video using tools like HandBrake or FFmpeg
2. Use a lower bitrate for web delivery
3. Consider creating multiple resolutions for different screen sizes
4. Test on mobile devices for performance

## Example FFmpeg Command
```bash
ffmpeg -i input-video.mp4 -c:v libx264 -crf 28 -preset medium -c:a aac -b:a 128k -movflags +faststart seven18-background.mp4
```
