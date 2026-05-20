import { pool } from '../db/pool';
import { CreateListingBody, UpdateListingBody, ListingsQuery } from '@uw-marketplace/shared';

export async function getListings(query: ListingsQuery) {
  const { q, category, minPrice, maxPrice, page = 1, limit = 24 } = query;
  const offset = (page - 1) * limit;
  const params: unknown[] = [];
  const conditions: string[] = ["l.status = 'active'"];

  if (q) {
    params.push(q);
    conditions.push(`l.search_vector @@ plainto_tsquery('english', $${params.length})`);
  }
  if (category) {
    params.push(category);
    conditions.push(`c.slug = $${params.length}`);
  }
  if (minPrice !== undefined) {
    params.push(minPrice);
    conditions.push(`l.price >= $${params.length}`);
  }
  if (maxPrice !== undefined) {
    params.push(maxPrice);
    conditions.push(`l.price <= $${params.length}`);
  }

  const where = conditions.length ? `WHERE ${conditions.join(' AND ')}` : '';

  const countRes = await pool.query(
    `SELECT COUNT(*) FROM listings l JOIN categories c ON c.id = l.category_id ${where}`,
    params
  );
  const total = parseInt(countRes.rows[0].count, 10);

  params.push(limit, offset);
  const { rows } = await pool.query(
    `SELECT l.id, l.seller_id, u.display_name AS seller_name, u.avatar_url AS seller_avatar,
            l.category_id, c.label AS category_label, l.title, l.description,
            l.price, l.status, l.created_at, l.updated_at,
            COALESCE(
              json_agg(
                json_build_object('id', li.id, 'cloudinaryId', li.cloudinary_id, 'url', li.url, 'displayOrder', li.display_order)
                ORDER BY li.display_order
              ) FILTER (WHERE li.id IS NOT NULL), '[]'
            ) AS images
     FROM listings l
     JOIN users u ON u.id = l.seller_id
     JOIN categories c ON c.id = l.category_id
     LEFT JOIN listing_images li ON li.listing_id = l.id
     ${where}
     GROUP BY l.id, u.display_name, u.avatar_url, c.label
     ORDER BY l.created_at DESC
     LIMIT $${params.length - 1} OFFSET $${params.length}`,
    params
  );

  return { listings: rows.map(mapListing), total, page, limit };
}

export async function getListingById(id: string) {
  const { rows } = await pool.query(
    `SELECT l.id, l.seller_id, u.display_name AS seller_name, u.avatar_url AS seller_avatar,
            l.category_id, c.label AS category_label, l.title, l.description,
            l.price, l.status, l.created_at, l.updated_at,
            COALESCE(
              json_agg(
                json_build_object('id', li.id, 'cloudinaryId', li.cloudinary_id, 'url', li.url, 'displayOrder', li.display_order)
                ORDER BY li.display_order
              ) FILTER (WHERE li.id IS NOT NULL), '[]'
            ) AS images
     FROM listings l
     JOIN users u ON u.id = l.seller_id
     JOIN categories c ON c.id = l.category_id
     LEFT JOIN listing_images li ON li.listing_id = l.id
     WHERE l.id = $1 AND l.status != 'deleted'
     GROUP BY l.id, u.display_name, u.avatar_url, c.label`,
    [id]
  );
  if (rows.length === 0) return null;
  return mapListing(rows[0]);
}

export async function createListing(sellerId: string, body: CreateListingBody) {
  const { rows } = await pool.query(
    `INSERT INTO listings (seller_id, category_id, title, description, price)
     VALUES ($1, $2, $3, $4, $5) RETURNING id`,
    [sellerId, body.categoryId, body.title, body.description, body.price]
  );
  return rows[0].id as string;
}

export async function updateListing(id: string, sellerId: string, body: UpdateListingBody) {
  const sets: string[] = [];
  const params: unknown[] = [];

  if (body.title !== undefined) { params.push(body.title); sets.push(`title = $${params.length}`); }
  if (body.description !== undefined) { params.push(body.description); sets.push(`description = $${params.length}`); }
  if (body.price !== undefined) { params.push(body.price); sets.push(`price = $${params.length}`); }
  if (body.categoryId !== undefined) { params.push(body.categoryId); sets.push(`category_id = $${params.length}`); }
  if (body.status !== undefined) { params.push(body.status); sets.push(`status = $${params.length}`); }

  if (sets.length === 0) return;

  sets.push(`updated_at = NOW()`);
  params.push(id, sellerId);

  const result = await pool.query(
    `UPDATE listings SET ${sets.join(', ')} WHERE id = $${params.length - 1} AND seller_id = $${params.length}`,
    params
  );
  if (result.rowCount === 0) throw new Error('Not authorized');
}

export async function deleteListing(id: string, sellerId: string) {
  const result = await pool.query(
    `UPDATE listings SET status = 'deleted' WHERE id = $1 AND seller_id = $2`,
    [id, sellerId]
  );
  if (result.rowCount === 0) throw new Error('Not authorized');
}

function mapListing(row: Record<string, unknown>) {
  return {
    id: row.id,
    sellerId: row.seller_id,
    sellerName: row.seller_name,
    sellerAvatar: row.seller_avatar,
    categoryId: row.category_id,
    categoryLabel: row.category_label,
    title: row.title,
    description: row.description,
    price: parseFloat(row.price as string),
    status: row.status,
    images: row.images,
    createdAt: row.created_at,
    updatedAt: row.updated_at,
  };
}
