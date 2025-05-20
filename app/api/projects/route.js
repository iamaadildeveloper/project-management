import { NextResponse } from 'next/server';

let projects = [];

export async function GET() {
  return NextResponse.json(projects);
}

export async function POST(request) {
  try {
    const projectData = await request.json();
    const id = Math.random().toString(36).substring(2, 9);
    
    // Determine if project is completed based on status
    const isCompleted = projectData.status === 'completed';
    
    const newProject = {
      id,
      ...projectData,
      completed: isCompleted, // Add this field
      createdAt: new Date().toISOString()
    };
    
    projects.push(newProject);
    return NextResponse.json({ success: true, project: newProject });
  } catch (error) {
    return NextResponse.json(
      { success: false, error: 'Failed to save project' },
      { status: 500 }
    );
  }
}