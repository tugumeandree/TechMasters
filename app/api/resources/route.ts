import { NextRequest, NextResponse } from 'next/server';
import connectDB from '@/lib/db';
import Resource from '@/lib/models/Resource';

export async function GET(request: NextRequest) {
  try {
    await connectDB();
    
    const { searchParams } = new URL(request.url);
    const stage = searchParams.get('stage');
    const pillar = searchParams.get('pillar');
    const type = searchParams.get('type');
    const featured = searchParams.get('featured');
    const limit = parseInt(searchParams.get('limit') || '10');

    // Build query
    const query: any = { isActive: true };
    if (stage) query.stage = stage;
    if (pillar) query.pillar = pillar;
    if (type) query.type = type;
    if (featured === 'true') query.featured = true;

    // Get resources
    const resources = await Resource.find(query)
      .sort({ featured: -1, rating: -1, createdAt: -1 })
      .limit(limit)
      .populate('authorId', 'name email');

    // Transform data
    const transformedResources = resources.map(resource => ({
      id: resource._id,
      title: resource.title,
      description: resource.description,
      type: resource.type,
      url: resource.url,
      stage: resource.stage,
      pillar: resource.pillar,
      rating: resource.rating,
      duration: resource.duration,
      featured: resource.featured,
      tags: resource.tags,
      viewCount: resource.viewCount,
      author: resource.authorId,
      createdAt: resource.createdAt
    }));

    return NextResponse.json({
      resources: transformedResources,
      count: transformedResources.length
    });
  } catch (error) {
    console.error('Error fetching resources:', error);
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    );
  }
}

export async function POST(request: NextRequest) {
  try {
    await connectDB();
    
    const body = await request.json();
    const {
      title,
      description,
      type,
      url,
      stage,
      pillar,
      rating,
      duration,
      featured,
      tags,
      authorId
    } = body;

    // Validation
    if (!title || !description || !type || !url) {
      return NextResponse.json(
        { error: 'Missing required fields' },
        { status: 400 }
      );
    }

    // Create resource
    const resource = await Resource.create({
      title,
      description,
      type,
      url,
      stage,
      pillar,
      rating,
      duration,
      featured: featured || false,
      tags: tags || [],
      authorId,
      isActive: true
    });

    return NextResponse.json(
      { resource, message: 'Resource created successfully' },
      { status: 201 }
    );
  } catch (error) {
    console.error('Error creating resource:', error);
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    );
  }
}
