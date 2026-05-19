import { cloudinary } from '../config/cloudinary';
import { pool } from '../db/pool';

export async function uploadImage(listingId: string, buffer: Buffer, mimetype: string) {
  const result = await new Promise<{ public_id: string; secure_url: string }>((resolve, reject) => {
    const stream = cloudinary.uploader.upload_stream(
      { folder: 'uw-marketplace', resource_type: 'image' },
      (err, res) => (err ? reject(err) : resolve(res!))
    );
    stream.end(buffer);
  });

  const { rows } = await pool.query(
    `INSERT INTO listing_images (listing_id, cloudinary_id, url, display_order)
     SELECT $1, $2, $3, COALESCE(MAX(display_order) + 1, 0)
     FROM listing_images WHERE listing_id = $1
     RETURNING id, cloudinary_id, url, display_order`,
    [listingId, result.public_id, result.secure_url]
  );

  return rows[0];
}

export async function deleteImage(listingId: string, imageId: string, sellerId: string) {
  // Verify the listing belongs to the seller
  const { rows: listingRows } = await pool.query(
    'SELECT id FROM listings WHERE id = $1 AND seller_id = $2',
    [listingId, sellerId]
  );
  if (listingRows.length === 0) throw new Error('Not authorized');

  const { rows } = await pool.query(
    'DELETE FROM listing_images WHERE id = $1 AND listing_id = $2 RETURNING cloudinary_id',
    [imageId, listingId]
  );
  if (rows.length === 0) throw new Error('Image not found');

  await cloudinary.uploader.destroy(rows[0].cloudinary_id);
}

export async function reorderImages(listingId: string, sellerId: string, orderedIds: string[]) {
  const { rows: listingRows } = await pool.query(
    'SELECT id FROM listings WHERE id = $1 AND seller_id = $2',
    [listingId, sellerId]
  );
  if (listingRows.length === 0) throw new Error('Not authorized');

  for (let i = 0; i < orderedIds.length; i++) {
    await pool.query(
      'UPDATE listing_images SET display_order = $1 WHERE id = $2 AND listing_id = $3',
      [i, orderedIds[i], listingId]
    );
  }
}
