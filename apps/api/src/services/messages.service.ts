import { pool } from '../db/pool';

export async function getConversations(userId: string) {
  const { rows } = await pool.query(
    `SELECT c.id, c.listing_id, l.title AS listing_title,
            (SELECT li.url FROM listing_images li WHERE li.listing_id = l.id ORDER BY li.display_order LIMIT 1) AS listing_image,
            c.buyer_id, ub.display_name AS buyer_name,
            c.seller_id, us.display_name AS seller_name,
            (SELECT m.body FROM messages m WHERE m.conversation_id = c.id ORDER BY m.created_at DESC LIMIT 1) AS last_message,
            (SELECT m.created_at FROM messages m WHERE m.conversation_id = c.id ORDER BY m.created_at DESC LIMIT 1) AS last_message_at,
            (SELECT COUNT(*) FROM messages m WHERE m.conversation_id = c.id AND m.sender_id != $1 AND m.read_at IS NULL) AS unread_count,
            c.created_at
     FROM conversations c
     JOIN listings l ON l.id = c.listing_id
     JOIN users ub ON ub.id = c.buyer_id
     JOIN users us ON us.id = c.seller_id
     WHERE c.buyer_id = $1 OR c.seller_id = $1
     ORDER BY last_message_at DESC NULLS LAST`,
    [userId]
  );
  return rows.map((r) => ({ ...r, unreadCount: parseInt(r.unread_count, 10) }));
}

export async function startConversation(buyerId: string, listingId: string) {
  const { rows: listingRows } = await pool.query(
    'SELECT seller_id FROM listings WHERE id = $1 AND status = $2',
    [listingId, 'active']
  );
  if (listingRows.length === 0) throw new Error('Listing not found or not active');
  if (listingRows[0].seller_id === buyerId) throw new Error('Cannot message your own listing');

  const { rows } = await pool.query(
    `INSERT INTO conversations (listing_id, buyer_id, seller_id)
     VALUES ($1, $2, $3)
     ON CONFLICT (listing_id, buyer_id) DO UPDATE SET listing_id = EXCLUDED.listing_id
     RETURNING id`,
    [listingId, buyerId, listingRows[0].seller_id]
  );
  return rows[0].id as string;
}

export async function getMessages(conversationId: string, userId: string, page = 1, limit = 50) {
  await assertParticipant(conversationId, userId);
  const offset = (page - 1) * limit;

  const { rows } = await pool.query(
    `SELECT m.id, m.conversation_id, m.sender_id, u.display_name AS sender_name,
            m.body, m.read_at, m.created_at
     FROM messages m
     JOIN users u ON u.id = m.sender_id
     WHERE m.conversation_id = $1
     ORDER BY m.created_at ASC
     LIMIT $2 OFFSET $3`,
    [conversationId, limit, offset]
  );
  return rows;
}

export async function sendMessage(conversationId: string, senderId: string, body: string) {
  await assertParticipant(conversationId, senderId);

  const { rows } = await pool.query(
    `INSERT INTO messages (conversation_id, sender_id, body)
     VALUES ($1, $2, $3)
     RETURNING id, conversation_id, sender_id, body, read_at, created_at`,
    [conversationId, senderId, body]
  );

  const { rows: userRows } = await pool.query(
    'SELECT display_name FROM users WHERE id = $1',
    [senderId]
  );

  return { ...rows[0], senderName: userRows[0].display_name };
}

export async function markRead(conversationId: string, userId: string) {
  await assertParticipant(conversationId, userId);
  await pool.query(
    `UPDATE messages SET read_at = NOW()
     WHERE conversation_id = $1 AND sender_id != $2 AND read_at IS NULL`,
    [conversationId, userId]
  );
}

async function assertParticipant(conversationId: string, userId: string) {
  const { rows } = await pool.query(
    'SELECT id FROM conversations WHERE id = $1 AND (buyer_id = $2 OR seller_id = $2)',
    [conversationId, userId]
  );
  if (rows.length === 0) throw new Error('Not a participant');
}
