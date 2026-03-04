// momentum-database/mongodb/schemas/communityPost.schema.js

const communityPostSchema = {
  $jsonSchema: {
    bsonType: "object",
    required: ["user_id", "content", "created_at"],
    properties: {
      _id: { bsonType: "objectId" },
      
      // Author
      user_id: { 
        bsonType: "string",
        pattern: "^[0-9a-f]{8}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{12}$"
      },
      
      // Content
      content: { bsonType: "string", maxLength: 5000 },
      
      // Media attachments
      media: {
        bsonType: "array",
        items: {
          bsonType: "object",
          properties: {
            type: { 
              bsonType: "string", 
              enum: ["image", "video", "audio"] 
            },
            url: { bsonType: "string" },
            thumbnail_url: { bsonType: "string" },
            alt_text: { bsonType: "string" }
          }
        }
      },
      
      // Visibility
      visibility: { 
        bsonType: "string",
        enum: ["public", "circle_only", "verified_only"],
        default: "public"
      },
      
      // Pregnancy context
      gestational_week: { bsonType: "int" },
      
      // Tags
      tags: {
        bsonType: "array",
        items: { bsonType: "string" }
      },
      
      // Engagement counts (denormalized for performance)
      likes_count: { bsonType: "int", default: 0 },
      comments_count: { bsonType: "int", default: 0 },
      shares_count: { bsonType: "int", default: 0 },
      
      // Interactions (for smaller counts, embedded)
      likes: {
        bsonType: "array",
        items: { bsonType: "string" }  // user_ids
      },
      
      // Comments (embedded for first few, then separate collection)
      comments: {
        bsonType: "array",
        items: {
          bsonType: "object",
          properties: {
            id: { bsonType: "string" },
            user_id: { bsonType: "string" },
            content: { bsonType: "string" },
            created_at: { bsonType: "date" },
            likes_count: { bsonType: "int", default: 0 }
          }
        }
      },
      
      // Anonymity
      is_anonymous: { bsonType: "bool", default: false },
      anonymous_name: { bsonType: "string" },  // "MamaBear123"
      
      // Moderation
      status: {
        bsonType: "string",
        enum: ["active", "under_review", "hidden", "deleted"],
        default: "active"
      },
      moderation_reason: { bsonType: "string" },
      reported_count: { bsonType: "int", default: 0 },
      
      // Timestamps
      created_at: { bsonType: "date" },
      updated_at: { bsonType: "date" },
      deleted_at: { bsonType: "date" }
    }
  }
};

// Indexes
db.community_posts.createIndex({ user_id: 1, created_at: -1 });
db.community_posts.createIndex({ created_at: -1 });
db.community_posts.createIndex({ tags: 1 });
db.community_posts.createIndex({ status: 1, created_at: -1 });
db.community_posts.createIndex({ gestational_week: 1 });
db.community_posts.createIndex(
  { content: "text", tags: "text" },
  { weights: { content: 10, tags: 5 } }
);

module.exports = { communityPostSchema };
