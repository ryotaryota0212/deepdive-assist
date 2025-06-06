ALTER TYPE mediatype RENAME TO mediatype_old;
CREATE TYPE mediatype AS ENUM ('movie', 'anime', 'book', 'game', 'music', 'other');
ALTER TABLE media ALTER COLUMN media_type TYPE mediatype USING media_type::text::mediatype;
DROP TYPE mediatype_old; 