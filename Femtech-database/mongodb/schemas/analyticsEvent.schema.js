// momentum-database/mongodb/schemas/analyticsEvent.schema.js

const analyticsEventSchema = {
  $jsonSchema: {
    bsonType: "object",
    required: ["event_type", "timestamp", "created_at"],
    properties: {
      _id: { bsonType: "objectId" },
      
      // Event type
      event_type: { 
        bsonType: "string",
        enum: [
          // Auth events
          "user.registered",
          "user.verified",
          "user.login",
          "user.logout",
          
          // Health events
          "pregnancy.registered",
          "symptom.logged",
          "triage.completed",
          "kick_session.completed",
          "appointment.scheduled",
          "appointment.completed",
          
          // Milestone events
          "milestone.started",
          "milestone.completed",
          "milestone.verified",
          
          // Token events
          "token.minted",
          "token.burned",
          "redemption.initiated",
          "redemption.completed",
          
          // Community events
          "post.created",
          "comment.created",
          "chat.message_sent",
          
          // Content events
          "article.viewed",
          "article.completed",
          "quiz.started",
          "quiz.completed",
          
          // System events
          "notification.sent",
          "notification.opened",
          "error.occurred"
        ]
      },
      
      // User (optional for anonymous events)
      user_id: { bsonType: "string" },
      session_id: { bsonType: "string" },
      
      // Event properties (flexible)
      properties: { bsonType: "object" },
      
      // Device info
      device: {
        bsonType: "object",
        properties: {
          platform: { 
            bsonType: "string",
            enum: ["ios", "android", "web", "ussd"]
          },
          os_version: { bsonType: "string" },
          app_version: { bsonType: "string" },
          device_model: { bsonType: "string" },
          screen_width: { bsonType: "int" },
          screen_height: { bsonType: "int" }
        }
      },
      
      // Location (approximate, for analytics)
      location: {
        bsonType: "object",
        properties: {
          country: { bsonType: "string" },
          region: { bsonType: "string" },
          city: { bsonType: "string" }
        }
      },
      
      // Timestamps
      timestamp: { bsonType: "date" },
      created_at: { bsonType: "date" }
    }
  }
};

// Indexes
db.analytics_events.createIndex({ event_type: 1, timestamp: -1 });
db.analytics_events.createIndex({ user_id: 1, timestamp: -1 });
db.analytics_events.createIndex({ timestamp: -1 });
db.analytics_events.createIndex({ session_id: 1 });
db.analytics_events.createIndex({ "device.platform": 1, timestamp: -1 });
db.analytics_events.createIndex({ "location.country": 1, timestamp: -1 });

// TTL index - auto-delete after 2 years
db.analytics_events.createIndex(
  { created_at: 1 }, 
  { expireAfterSeconds: 63072000 }
);

module.exports = { analyticsEventSchema };
