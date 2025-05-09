import { NextResponse } from 'next/server';
import Video from '@/models/Video';

export async function GET(
  request: Request,
  { params }: { params: { id: string } }
) {
  try {
    const { searchParams } = new URL(request.url);
    const limit = parseInt(searchParams.get('limit') || '10');

    // Get the current video
    const currentVideo = await Video.findById(params.id);
    if (!currentVideo) {
      return NextResponse.json(
        { error: 'Video not found' },
        { status: 404 }
      );
    }

    // Find related videos based on multiple criteria
    const relatedVideos = await Video.find({
      _id: { $ne: currentVideo._id }, // Exclude current video
      $or: [
        { category: currentVideo.category }, // Same category
        { tags: { $in: currentVideo.tags } }, // Matching tags
        { creatorId: currentVideo.creatorId }, // Same creator
      ],
      visibility: 'public', // Only public videos
    })
    .sort({ 'stats.views': -1 }) // Sort by views
    .limit(limit)
    .select('-filePath -previewPath') // Exclude sensitive fields
    .lean();

    return NextResponse.json({
      videos: relatedVideos,
      page: 1,
      totalPages: 1,
      total: relatedVideos.length
    });

  } catch (error) {
    console.error('Error fetching related videos:', error);
    return NextResponse.json(
      { error: 'Failed to fetch related videos' },
      { status: 500 }
    );
  }
} 