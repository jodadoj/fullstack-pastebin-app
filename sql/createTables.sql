 CREATE TABLE paste_bin(
  id SERIAL PRIMARY KEY,
  name TEXT NOT NULL,
  text TEXT,
  rating NUMERIC
);

INSERT INTO paste_bin (name, text)
VALUES
  ('bob', 'SW,W,S'),
  ('andy', 'SW,E,SE'),
  ('jannet', 'All directions'),
  ('anna', 'N,NW,NE'),
  ('steve', 'S,SE');

CREATE TABLE comments (
  comment_id SERIAL PRIMARY KEY,
  paste_id INTEGER REFERENCES paste_bin(id),
  name TEXT NOT NULL,
  comment TEXT NOT NULL
  
);


INSERT INTO comments (paste_id, name, comment)
VALUES
  (1, 'John', 'This spot is amazing!'),
  (1, 'Alice', 'I had a great time here.'),
  (1, 'Bob', 'I will definitely come back.'),
  (2, 'Alice', 'The directions were a little confusing.'),
  (2, 'Bob', 'I got lost a few times.'),
  (2, 'John', 'I found it eventually though.'),
  (3, 'Bob', 'This spot was breathtaking.'),
  (3, 'Alice', 'I highly recommend it.'),
  (4, 'John', 'I did not like this spot at all.'),
  (4, 'Bob', 'I agree, it was not very enjoyable.');


