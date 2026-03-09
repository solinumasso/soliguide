

FROM mongo:7.0

WORKDIR /scripts

# Copy seed script
COPY --chmod=0544 --chown=mongodb:mongodb ./packages/api/qovery/seed-mongodb/seed-mongo-test-db.sh /scripts/seed-mongo-test-db.sh

# Copy test dump
COPY --chown=mongodb:mongodb ./data /data

USER mongodb

ENTRYPOINT ["/scripts/seed-mongo-test-db.sh"]
