CREATE TABLE dbo.userMsg_tbl (
    msgId INT PRIMARY KEY IDENTITY(1,1), -- Auto-incremented ID
    FullName NVARCHAR(255) NOT NULL,    -- Title of the blog post
    Email NVARCHAR(255) NOT NULL,    -- Path or filename for the image
    content NVARCHAR(MAX) NOT NULL, -- HTML content of the post
    lang NVARCHAR(2) NOT NULL           -- Boolean column with a default value of 0 (false)
);
