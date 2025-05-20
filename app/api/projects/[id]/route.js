import { NextResponse } from 'next/server';

// Shared in-memory storage
let projects = [];

export async function PATCH(request, { params }) {
  try {
    const { id } = params;
    const updateData = await request.json();
    
    console.log(`Updating project ${id} with:`, updateData); // Debug log
    
    if (!id) {
      return NextResponse.json(
        { error: 'Project ID is required' },
        { status: 400 }
      );
    }

    const projectIndex = projects.findIndex(project => project.id === id);
    
    console.log('Current projects:', projects); // Debug log
    
    if (projectIndex === -1) {
      return NextResponse.json(
        { error: 'Project not found' },
        { status: 404 }
      );
    }

    // Update the project
    projects[projectIndex] = {
      ...projects[projectIndex],
      ...updateData,
      updatedAt: new Date().toISOString()
    };
    
    console.log('Updated project:', projects[projectIndex]); // Debug log
    
    return NextResponse.json(
      { success: true, project: projects[projectIndex] },
      { status: 200 }
    );
    
  } catch (error) {
  console.error('Error saving project:', error); // Log the error
  return NextResponse.json(
    { 
      success: false, 
      error: error.message || 'Failed to save project' // Use the error
    },
    { status: 500 }
  );
}
}