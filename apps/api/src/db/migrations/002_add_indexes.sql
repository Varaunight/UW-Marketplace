CREATE INDEX idx_listings_seller   ON listings(seller_id);
CREATE INDEX idx_listings_category ON listings(category_id);
CREATE INDEX idx_listings_status   ON listings(status);
CREATE INDEX idx_listings_price    ON listings(price);
CREATE INDEX idx_listings_created  ON listings(created_at DESC);
CREATE INDEX idx_listings_fts      ON listings USING GIN(search_vector);

CREATE INDEX idx_listing_images_lid ON listing_images(listing_id, display_order);

CREATE INDEX idx_messages_conv     ON messages(conversation_id, created_at);
CREATE INDEX idx_conversations_buy ON conversations(buyer_id);
CREATE INDEX idx_conversations_sel ON conversations(seller_id);

CREATE INDEX idx_refresh_tokens_user ON refresh_tokens(user_id);
