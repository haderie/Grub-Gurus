/**
 * Represents a YouTube video object.
 * - `id`: Contains the unique identifier for the video.
 * - `videoId`: The unique ID of the video on YouTube.
 * - `snippet`: Contains basic metadata about the video.
 * - `title`: The title of the video.
 * - `description`: A brief description of the video content.
 * - `thumbnails`: The different thumbnail images for the video.
 * - `default`: The default thumbnail image for the video.
 * - `url`: The URL to the default thumbnail image.
 */

export interface YouTubeVideo {
  id: {
    videoId: string;
  };
  snippet: {
    title: string;
    description: string;
    thumbnails: {
      default: {
        url: string;
      };
    };
  };
}
