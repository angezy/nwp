CREATE TABLE dbo.BlogPosts_tbl (
    postId INT PRIMARY KEY IDENTITY(1,1), -- Auto-incremented ID
    Title NVARCHAR(255) NOT NULL,    -- Title of the blog post
    Imag NVARCHAR(255) NOT NULL,    -- Path or filename for the image
    Contents NVARCHAR(MAX) NOT NULL, -- HTML content of the post
    CreatedAt DATETIME DEFAULT GETDATE() -- Timestamp for when the post was created
);

INSERT INTO BlogPosts (Title, Image, Contents)
VALUES 
('First Blog Post', 'sample-image.jpg', '<p>This is the content of the first blog post.</p>'),
('Second Blog Post', 'second-image.jpg', '<p>This is the content of the second blog post.</p>'),
('Third Blog Post', 'third-image.jpg', '<p>This is the content of the third blog post.</p>');

