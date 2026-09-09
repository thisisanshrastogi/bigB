import { uploadImage, listImages, deleteImage, renameImage } from '@/lib/images';

export async function POST(request) {
  try {
    const formData = await request.formData();
    const file = formData.get('file');
    const customName = formData.get('customName');

    if (!file) {
      return Response.json({ error: 'No file provided' }, { status: 400 });
    }

    // Convert File to Buffer
    const arrayBuffer = await file.arrayBuffer();
    const buffer = Buffer.from(arrayBuffer);

    // Determine filename
    let finalName = file.name;
    if (customName && customName.trim() !== '') {
      const ext = file.name.split('.').pop();
      finalName = `${customName.trim()}.${ext}`;
    }

    // Upload to S3
    const imageMetadata = await uploadImage(buffer, finalName, file.type);

    return Response.json({ 
      message: 'Upload successful', 
      image: imageMetadata 
    }, { status: 201 });
    
  } catch (error) {
    console.error('Upload error:', error);
    return Response.json({ error: 'Upload failed', details: error.message }, { status: 500 });
  }
}

export async function GET(request) {
  try {
    const { searchParams } = new URL(request.url);
    const token = searchParams.get('token');
    const search = searchParams.get('search');
    
    const result = await listImages(token, search);
    return Response.json(result);
  } catch (error) {
    console.error('Fetch images error:', error);
    return Response.json({ error: 'Fetch failed', details: error.message }, { status: 500 });
  }
}

export async function DELETE(request) {
  try {
    const { searchParams } = new URL(request.url);
    const key = searchParams.get('key');
    if (!key) return Response.json({ error: 'Key is required' }, { status: 400 });

    await deleteImage(key);
    return Response.json({ message: 'Deleted successfully' });
  } catch (error) {
    console.error('Delete error:', error);
    return Response.json({ error: 'Delete failed', details: error.message }, { status: 500 });
  }
}

export async function PATCH(request) {
  try {
    const body = await request.json();
    const { key, newName } = body;
    
    if (!key || !newName) {
      return Response.json({ error: 'Key and newName are required' }, { status: 400 });
    }

    const result = await renameImage(key, newName);
    return Response.json({ message: 'Renamed successfully', newKey: result.newKey });
  } catch (error) {
    console.error('Rename error:', error);
    return Response.json({ error: 'Rename failed', details: error.message }, { status: 500 });
  }
}
