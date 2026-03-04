// momentum-database/mongodb/schemas/symptomLog.schema.js

const symptomLogSchema = {
  $jsonSchema: {
    bsonType: "object",
    required: ["user_id", "pregnancy_id", "check_in_date", "symptoms", "created_at"],
    properties: {
      _id: { bsonType: "objectId" },
      
      // References (UUIDs from PostgreSQL)
      user_id: { 
        bsonType: "string",
        pattern: "^[0-9a-f]{8}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{12}$"
      },
      pregnancy_id: { 
        bsonType: "string",
        pattern: "^[0-9a-f]{8}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{12}$"
      },
      
      // Date
      check_in_date: { bsonType: "date" },
      gestational_week: { bsonType: "int", minimum: 1, maximum: 45 },
      
      // Symptoms array
      symptoms: {
        bsonType: "array",
        items: {
          bsonType: "object",
          required: ["code", "severity"],
          properties: {
            code: { bsonType: "string" },  // SATS code
            name: { bsonType: "string" },
            severity: { 
              bsonType: "string", 
              enum: ["mild", "moderate", "severe"] 
            },
            duration_hours: { bsonType: "int" },
            notes: { bsonType: "string" }
          }
        }
      },
      
      // Vitals
      vitals: {
        bsonType: "object",
        properties: {
          blood_pressure_systolic: { bsonType: "int" },
          blood_pressure_diastolic: { bsonType: "int" },
          heart_rate: { bsonType: "int" },
          temperature: { bsonType: "double" },
          weight_kg: { bsonType: "double" },
          blood_glucose: { bsonType: "double" }
        }
      },
      
      // Mood tracking
      mood: {
        bsonType: "object",
        properties: {
          score: { bsonType: "int", minimum: 1, maximum: 5 },
          emotions: { 
            bsonType: "array",
            items: { bsonType: "string" }
          },
          sleep_hours: { bsonType: "double" },
          sleep_quality: { 
            bsonType: "string", 
            enum: ["poor", "fair", "good", "excellent"] 
          },
          anxiety_level: { bsonType: "int", minimum: 0, maximum: 10 },
          notes: { bsonType: "string" }
        }
      },
      
      // Fetal movement
      fetal_movement: {
        bsonType: "object",
        properties: {
          felt_movement: { bsonType: "bool" },
          movement_pattern: { 
            bsonType: "string",
            enum: ["normal", "reduced", "increased", "none"]
          },
          kick_count: { bsonType: "int" },
          movement_notes: { bsonType: "string" }
        }
      },
      
      // Triage result (from risk engine)
      triage_result: {
        bsonType: "object",
        properties: {
          level: { 
            bsonType: "string",
            enum: ["red", "orange", "yellow", "green"]
          },
          score: { bsonType: "int", minimum: 0, maximum: 100 },
          primary_concern: { bsonType: "string" },
          recommendations: {
            bsonType: "array",
            items: { bsonType: "string" }
          },
          action_required: { bsonType: "string" },
          processed_at: { bsonType: "date" }
        }
      },
      
      // Free text notes (encrypted)
      notes_encrypted: { bsonType: "binData" },
      
      // Sync status
      synced_from_offline: { bsonType: "bool", default: false },
      offline_created_at: { bsonType: "date" },
      
      // Timestamps
      created_at: { bsonType: "date" },
      updated_at: { bsonType: "date" }
    }
  }
};

// Indexes
db.symptom_logs.createIndex({ user_id: 1, check_in_date: -1 });
db.symptom_logs.createIndex({ pregnancy_id: 1 });
db.symptom_logs.createIndex({ check_in_date: -1 });
db.symptom_logs.createIndex({ "triage_result.level": 1 });
db.symptom_logs.createIndex({ user_id: 1, "triage_result.level": 1 });
db.symptom_logs.createIndex({ created_at: -1 });

// TTL index for data retention (optional - 5 years)
// db.symptom_logs.createIndex({ created_at: 1 }, { expireAfterSeconds: 157680000 });

module.exports = { symptomLogSchema };
