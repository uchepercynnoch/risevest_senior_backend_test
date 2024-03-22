CREATE TABLE IF NOT EXISTS Users
(
    id   SERIAL PRIMARY KEY,
    name VARCHAR NOT NULL
);

CREATE TABLE IF NOT EXISTS Posts
(
    id     SERIAL PRIMARY KEY,
    userId INT     NOT NULL,
    title  VARCHAR NOT NULL,
    CONSTRAINT fk_user FOREIGN KEY (userId) REFERENCES Users (id)
);

CREATE TABLE IF NOT EXISTS Comments
(
    id        SERIAL PRIMARY KEY,
    postId    INT  NOT NULL,
    content   TEXT NOT NULL,
    createdAt DATE NOT NULL,
    CONSTRAINT fk_post FOREIGN KEY (postId) REFERENCES Posts (id)
)
