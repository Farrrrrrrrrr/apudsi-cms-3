import { NextRequest, NextResponse } from 'next/server';
import { getServerSession } from 'next-auth';
import { createSimpleArticle } from '@/lib/database';

export async function POST(request: NextRequest) {
  try {
    // Check authentication
    const session = await getServerSession();
    if (!session?.user) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }
    
    // Parse the request body
    const body = await request.json();
    const { title, imageUrl, content, authorId } = body;
    
    if (!title || !imageUrl || !content || !authorId) {
      return NextResponse.json({ error: 'Missing required fields' }, { status: 400 });
    }
    
    // Create a new article
    const article = await createSimpleArticle({
      title,
      image_url: imageUrl,
      content,
      author_id: parseInt(authorId, 10),
      status: 'draft' // Explicitly set status as draft
    });
    
    return NextResponse.json(article, { status: 201 });
  } catch (error) {
    console.error('Error creating draft article:', error);
    return NextResponse.json({ error: 'Internal Server Error' }, { status: 500 });
  }
}

export async function GET() {
  // This would return a list of articles
  // Implement based on your needs
  return NextResponse.json({ articles: [] });
}
