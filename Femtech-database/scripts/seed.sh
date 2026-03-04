#!/bin/bash

# ============================================
# FEMTECH AFRICA - DATABASE SEED RUNNER
# ============================================

set -e

# Colors for output
RED='\033[0;31m'
GREEN='\033[0;32m'
YELLOW='\033[1;33m'
NC='\033[0m' # No Color

echo -e "${GREEN}========================================${NC}"
echo -e "${GREEN}  Femtech Africa - Database Seeding${NC}"
echo -e "${GREEN}========================================${NC}"

# Load environment variables
if [ -f .env ]; then
  export $(cat .env | grep -v '#' | xargs)
fi

# Default values
POSTGRES_HOST=${POSTGRES_HOST:-localhost}
POSTGRES_PORT=${POSTGRES_PORT:-5432}
POSTGRES_DB=${POSTGRES_DB:-femtech}
POSTGRES_USER=${POSTGRES_USER:-postgres}
MONGO_URI=${MONGO_URI:-mongodb://localhost:27017}

# Parse arguments
SEED_TYPE=${1:-all}
ENVIRONMENT=${2:-development}

echo -e "\n${YELLOW}Environment: ${ENVIRONMENT}${NC}"
echo -e "${YELLOW}Seed Type: ${SEED_TYPE}${NC}\n"

# Function to run PostgreSQL seeds
seed_postgres() {
  echo -e "${GREEN}Seeding PostgreSQL...${NC}"
  
  SEED_DIR="./postgres/seeds"
  
  # Run seeds in order
  for seed_file in $(ls -1 ${SEED_DIR}/*.sql | sort); do
    echo -e "  Running: ${seed_file}"
    PGPASSWORD=${POSTGRES_PASSWORD} psql \
      -h ${POSTGRES_HOST} \
      -p ${POSTGRES_PORT} \
      -U ${POSTGRES_USER} \
      -d ${POSTGRES_DB} \
      -f ${seed_file} \
      -q
  done
  
  echo -e "${GREEN}PostgreSQL seeding complete!${NC}\n"
}

# Function to run MongoDB seeds
seed_mongodb() {
  echo -e "${GREEN}Seeding MongoDB...${NC}"
  
  SEED_DIR="./mongodb/seeds"
  
  for seed_file in $(ls -1 ${SEED_DIR}/*.js | sort); do
    echo -e "  Running: ${seed_file}"
    mongosh ${MONGO_URI} ${seed_file} --quiet
  done
  
  echo -e "${GREEN}MongoDB seeding complete!${NC}\n"
}

# Function to seed Redis (if needed)
seed_redis() {
  echo -e "${GREEN}Setting up Redis cache keys...${NC}"
  
  # Add any Redis initialization here
  # redis-cli -h ${REDIS_HOST} -p ${REDIS_PORT} < ./redis/seeds/init.redis
  
  echo -e "${GREEN}Redis setup complete!${NC}\n"
}

# Function to verify seed data
verify_seeds() {
  echo -e "${GREEN}Verifying seed data...${NC}"
  
  # PostgreSQL counts
  echo -e "\n${YELLOW}PostgreSQL record counts:${NC}"
  PGPASSWORD=${POSTGRES_PASSWORD} psql \
    -h ${POSTGRES_HOST} \
    -p ${POSTGRES_PORT} \
    -U ${POSTGRES_USER} \
    -d ${POSTGRES_DB} \
    -c "SELECT 
          (SELECT COUNT(*) FROM users) as users,
          (SELECT COUNT(*) FROM pregnancies) as pregnancies,
          (SELECT COUNT(*) FROM facilities) as facilities,
          (SELECT COUNT(*) FROM partners) as partners,
          (SELECT COUNT(*) FROM partner_products) as products,
          (SELECT COUNT(*) FROM milestone_definitions) as milestones,
          (SELECT COUNT(*) FROM digital_doulas) as doulas,
          (SELECT COUNT(*) FROM verifiers) as verifiers;"
  
  # MongoDB counts
  echo -e "\n${YELLOW}MongoDB record counts:${NC}"
  mongosh ${MONGO_URI}/femtech_health --eval "
    print('symptom_logs: ' + db.symptom_logs.countDocuments());
  " --quiet
  
  echo -e "\n${GREEN}Verification complete!${NC}"
}

# Main execution
case ${SEED_TYPE} in
  all)
    seed_postgres
    seed_mongodb
    seed_redis
    verify_seeds
    ;;
  postgres)
    seed_postgres
    ;;
  mongodb)
    seed_mongodb
    ;;
  redis)
    seed_redis
    ;;
  verify)
    verify_seeds
    ;;
  *)
    echo -e "${RED}Unknown seed type: ${SEED_TYPE}${NC}"
    echo "Usage: ./seed.sh [all|postgres|mongodb|redis|verify] [development|staging]"
    exit 1
    ;;
esac

echo -e "\n${GREEN}========================================${NC}"
echo -e "${GREEN}  Seeding Complete!${NC}"
echo -e "${GREEN}========================================${NC}"
