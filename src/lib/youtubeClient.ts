export interface SyncedChannelData {
  channelName: string;
  subscribers: number;
  totalViews: number;
  videos: Array<{ id: string; title: string; publishedAt: string; views: number }>;
}

const parseChannelIdFromUrl = (input: string): string | null => {
  const text = input.trim();
  const m = text.match(/\/channel\/(UC[\w-]+)/);
  return m?.[1] ?? null;
};

async function resolveChannelId(input: string, apiKey: string): Promise<string> {
  const direct = parseChannelIdFromUrl(input);
  if (direct) return direct;

  const handleMatch = input.match(/@([A-Za-z0-9_.-]+)/);
  const query = handleMatch?.[1] ?? input.trim();

  const url = `https://www.googleapis.com/youtube/v3/search?part=snippet&type=channel&maxResults=1&q=${encodeURIComponent(query)}&key=${apiKey}`;
  const res = await fetch(url);
  if (!res.ok) throw new Error(`Failed channel lookup (${res.status})`);
  const json = await res.json();
  const channelId = json?.items?.[0]?.snippet?.channelId;
  if (!channelId) throw new Error('Could not resolve channel ID from link/handle');
  return String(channelId);
}

export async function syncYoutubeChannel(input: string, apiKey: string): Promise<SyncedChannelData> {
  const channelId = await resolveChannelId(input, apiKey);

  const channelRes = await fetch(`https://www.googleapis.com/youtube/v3/channels?part=snippet,statistics&id=${channelId}&key=${apiKey}`);
  if (!channelRes.ok) throw new Error(`Failed channel stats (${channelRes.status})`);
  const channelJson = await channelRes.json();
  const channel = channelJson?.items?.[0];
  if (!channel) throw new Error('Channel not found');

  const searchRes = await fetch(`https://www.googleapis.com/youtube/v3/search?part=snippet&channelId=${channelId}&order=date&type=video&maxResults=8&key=${apiKey}`);
  if (!searchRes.ok) throw new Error(`Failed video list (${searchRes.status})`);
  const searchJson = await searchRes.json();
  const ids = (searchJson?.items ?? []).map((i: any) => i?.id?.videoId).filter(Boolean).join(',');

  let videoStatsMap: Record<string, number> = {};
  if (ids) {
    const videosRes = await fetch(`https://www.googleapis.com/youtube/v3/videos?part=statistics&id=${ids}&key=${apiKey}`);
    if (videosRes.ok) {
      const videosJson = await videosRes.json();
      videoStatsMap = Object.fromEntries((videosJson?.items ?? []).map((v: any) => [v.id, Number(v?.statistics?.viewCount ?? 0)]));
    }
  }

  const videos = (searchJson?.items ?? []).map((item: any) => ({
    id: String(item.id.videoId),
    title: String(item.snippet.title),
    publishedAt: String(item.snippet.publishedAt),
    views: Number(videoStatsMap[item.id.videoId] ?? 0),
  }));

  return {
    channelName: String(channel?.snippet?.title ?? 'Connected Channel'),
    subscribers: Number(channel?.statistics?.subscriberCount ?? 0),
    totalViews: Number(channel?.statistics?.viewCount ?? 0),
    videos,
  };
}
