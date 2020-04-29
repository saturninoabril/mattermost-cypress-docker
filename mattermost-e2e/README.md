#### Run Docker compose
```
------- *** -------

cd dev-server
docker-compose --no-ansi run --rm start_dependencies
cat test-data/ldap-data.ldif | docker-compose --no-ansi exec -T openldap bash -c 'ldapadd -x -D "cn=admin,dc=mm,dc=test,dc=com" -w mostest';
docker-compose --no-ansi exec -T minio sh -c 'mkdir -p /data/mattermost-test';
docker-compose --no-ansi ps

<!-- docker run --net dev-server_mm-test appropriate/curl:latest sh -c "until curl --max-time 5 --output - http://mysql:3306; do echo waiting for mysql; sleep 5; done;" -->

docker-compose --no-ansi exec -T postgres sh -c 'exec echo "CREATE DATABASE migrated; CREATE DATABASE latest;" | exec psql -U mmuser mattermost_test'

docker run --net dev-server_mm-test appropriate/curl:latest sh -c "until curl --max-time 5 --output - http://elasticsearch:9200; do echo waiting for elasticsearch; sleep 5; done;"

cd app
docker build -t saturn/app .

# Should run on a folder where the license is located so that the next license upload will work
# Could be at `/home/ubuntu`
docker run -it -d --net dev-server_mm-test --name app --rm -e MM_USERNAME=mmuser -e MM_PASSWORD=mmuser_password -e MM_DBNAME=mattermost --env MM_EMAILSETTINGS_SMTPSERVER=inbucket --env MM_EMAILSETTINGS_SMTPPORT=10025 --env MM_ELASTICSEARCHSETTINGS_CONNECTIONURL=http://elasticsearch:9200 --env MM_SQLSETTINGS_DATASOURCE="postgres://mmuser:mostest@postgres:5432/migrated?sslmode=disable&connect_timeout=10" --env MM_SQLSETTINGS_DRIVERNAME=postgres --env MM_SERVICESETTINGS_ALLOWEDUNTRUSTEDINTERNALCONNECTIONS="localhost 127.0.0.1 webhook" -v `pwd`:`pwd` -p 8000:8000 saturn/app:latest

docker run --net dev-server_mm-test --rm appropriate/curl:latest sh -c "until curl --max-time 5 --output - http://app:8000; do echo waiting for app; sleep 5; done;"

------- *** -------

// Set volume directory to work
docker exec app mattermost license upload ~/mm-license.txt

docker exec app mattermost config set TeamSettings.MaxUsersPerTeam 1000
docker exec app mattermost sampledata -w 4 -u 60 --deactivated-users=200

make move-webhook-src
cd dev-server/webhook
docker build -t saturn/webhook .
docker run -it -d --net dev-server_mm-test --name webhook --rm saturn/webhook
docker run --net dev-server_mm-test --rm appropriate/curl:latest sh -c "until curl --max-time 5 --output - http://webhook:3000; do echo waiting for app; sleep 5; done;"

make move-cypress-e2e
cd dev-server/cypress
docker build -t saturn/cypress .
docker run --net dev-server_mm-test --rm --name cypress -e CYPRESS_baseUrl=http://app:8000 -e CYPRESS_webhookBaseUrl=http://webhook:3000 saturn/cypress
```