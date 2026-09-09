import { S3Client, PutObjectCommand, DeleteObjectCommand, ListObjectsV2Command, CopyObjectCommand } from "@aws-sdk/client-s3";

// Configure S3 Client
// You can provide a standard AWS connection string or custom endpoint later
// via environment variables.
const s3Client = new S3Client({
  region: process.env.AWS_REGION || "us-east-1",
  credentials: {
    accessKeyId: process.env.AWS_ACCESS_KEY_ID || "",
    secretAccessKey: process.env.AWS_SECRET_ACCESS_KEY || "",
  },
  // Uncomment and use this if your connection string provides a custom endpoint (e.g. for Cloudflare R2, DigitalOcean)
  // endpoint: process.env.AWS_ENDPOINT_URL, 
});

const BUCKET_NAME = process.env.AWS_S3_BUCKET_NAME || process.env.AWS_S3_BUCKET || "";

/**
 * Uploads an image buffer to S3.
 * 
 * @param {Buffer} buffer - The image buffer to upload.
 * @param {string} filename - The original filename.
 * @param {string} mimeType - The mime type of the file.
 * @returns {Promise<Object>} - Metadata including URL, variants, and blurhash.
 */
export async function uploadImage(buffer, filename, mimeType) {
  // Create a unique key for the file
  const cleanName = filename.replace(/[^a-zA-Z0-9.-]/g, '_');
  const extMatch = cleanName.match(/\.[^.]+$/);
  const ext = extMatch ? extMatch[0] : '';
  const nameWithoutExt = ext ? cleanName.slice(0, -ext.length) : cleanName;
  const fileKey = `amalgamic-blog/${nameWithoutExt}-${Date.now()}${ext}`;

  const command = new PutObjectCommand({
    Bucket: BUCKET_NAME,
    Key: fileKey,
    Body: buffer,
    ContentType: mimeType,
  });

  await s3Client.send(command);

  // Construct the public URL. 
  // If you use a custom domain or CDN, you can override this via NEXT_PUBLIC_IMAGE_DOMAIN
  const baseUrl = process.env.NEXT_PUBLIC_IMAGE_DOMAIN 
    ? `https://${process.env.NEXT_PUBLIC_IMAGE_DOMAIN}` 
    : `https://${BUCKET_NAME}.s3.${process.env.AWS_REGION || "us-east-1"}.amazonaws.com`;
    
  const url = `${baseUrl}/${fileKey}`;

  return {
    filename,
    mime: mimeType,
    bytes: buffer.length,
    width: null, // Image processing library needed to determine dimensions in Node
    height: null,
    url: url,
    public_id: fileKey,
    blurhash: 'placeholder_blurhash',
    variants: {
      sm: url, // Standard S3 doesn't auto-generate variants, so we use the original
      md: url,
      lg: url
    }
  };
}

export async function deleteImage(public_id) {
  const command = new DeleteObjectCommand({
    Bucket: BUCKET_NAME,
    Key: public_id,
  });

  return await s3Client.send(command);
}

export async function listImages(continuationToken = null, searchPrefix = null) {
  const baseUrl = process.env.NEXT_PUBLIC_IMAGE_DOMAIN 
    ? `https://${process.env.NEXT_PUBLIC_IMAGE_DOMAIN}` 
    : `https://${BUCKET_NAME}.s3.${process.env.AWS_REGION || "us-east-1"}.amazonaws.com`;

  if (searchPrefix) {
    const searchLower = searchPrefix.toLowerCase();
    let allMatches = [];
    let isTruncated = true;
    let token = null; // Search always starts from beginning
    
    while (isTruncated) {
      const command = new ListObjectsV2Command({
        Bucket: BUCKET_NAME,
        Prefix: 'amalgamic-blog/',
        ...(token && { ContinuationToken: token })
      });
      const response = await s3Client.send(command);
      
      if (response.Contents) {
        const matches = response.Contents.filter(item => {
           const filename = item.Key.split('/').pop().toLowerCase();
           return filename.includes(searchLower);
        });
        
        const mapped = matches.map(item => ({
          url: `${baseUrl}/${item.Key}`,
          key: item.Key,
          lastModified: item.LastModified,
          size: item.Size
        }));
        allMatches = [...allMatches, ...mapped];
      }
      isTruncated = response.IsTruncated;
      token = response.NextContinuationToken;
    }
    
    allMatches.sort((a, b) => new Date(b.lastModified) - new Date(a.lastModified));
    return {
      images: allMatches,
      nextContinuationToken: null // return all search results at once
    };
  }

  // Normal paginated fetch
  const command = new ListObjectsV2Command({
    Bucket: BUCKET_NAME,
    Prefix: 'amalgamic-blog/',
    MaxKeys: 30,
    ...(continuationToken && { ContinuationToken: continuationToken })
  });

  const response = await s3Client.send(command);
  
  if (!response.Contents) {
    return { images: [], nextContinuationToken: null };
  }
  
  const images = response.Contents.map(item => ({
    url: `${baseUrl}/${item.Key}`,
    key: item.Key,
    lastModified: item.LastModified,
    size: item.Size
  })).sort((a, b) => new Date(b.lastModified) - new Date(a.lastModified));

  return {
    images,
    nextContinuationToken: response.NextContinuationToken || null
  };
}

export async function renameImage(oldKey, newFilename) {
  // Extract path and extension from oldKey
  const pathParts = oldKey.split('/');
  const oldFilename = pathParts.pop(); // e.g., '1631234567890-hero.png'
  const prefix = pathParts.join('/') + (pathParts.length > 0 ? '/' : ''); // e.g., 'amalgamic-blog/'
  
  // Extract timestamp from start OR end of oldFilename (13 digits for Date.now())
  let timestamp = Date.now();
  const startMatch = oldFilename.match(/^(\d{13})-/);
  const endMatch = oldFilename.match(/-(\d{13})(?:\.[^.]+)?$/);
  
  if (startMatch) timestamp = startMatch[1];
  else if (endMatch) timestamp = endMatch[1];
  
  // Clean new filename and separate extension
  const cleanName = newFilename.replace(/[^a-zA-Z0-9.-]/g, '_');
  const newExtMatch = cleanName.match(/\.[^.]+$/);
  
  // If the user didn't provide an extension, try to preserve the old one
  const oldExtMatch = oldFilename.match(/\.[^.]+$/);
  const oldExt = oldExtMatch ? oldExtMatch[0] : '';
  
  const ext = newExtMatch ? newExtMatch[0] : oldExt;
  const nameWithoutExt = newExtMatch ? cleanName.slice(0, -ext.length) : cleanName;
  
  const newKey = `${prefix}${nameWithoutExt}-${timestamp}${ext}`;

  if (oldKey === newKey) {
    return { newKey }; // No change
  }

  // Copy object
  const copyCommand = new CopyObjectCommand({
    Bucket: BUCKET_NAME,
    CopySource: encodeURI(`${BUCKET_NAME}/${oldKey}`),
    Key: newKey
  });
  await s3Client.send(copyCommand);

  // Delete old object
  const deleteCommand = new DeleteObjectCommand({
    Bucket: BUCKET_NAME,
    Key: oldKey
  });
  await s3Client.send(deleteCommand);

  return { newKey };
}
