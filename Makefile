.PHONY: docker-clean

docker-clean:
	docker system prune
	docker system prune -a
	docker images purge
	docker rm $(docker ps -a -f status=exited -q)
	docker volume prune

up:
	cd mattermost-e2e && docker-compose --no-ansi run --rm start_dependencies
	@echo --- Dependencies started

	cd mattermost-e2e && cat test-data/ldap-data.ldif | docker-compose --no-ansi exec -T openldap bash -c 'ldapadd -x -D "cn=admin,dc=mm,dc=test,dc=com" -w mostest';
	@echo --- LDAP users added

	cd mattermost-e2e && docker-compose --no-ansi exec -T minio sh -c 'mkdir -p /data/mattermost-test';
	@echo --- minio: created "/data/mattermost-test"

	cd mattermost-e2e && docker-compose --no-ansi ps
	@echo --- See state of containers

	cd mattermost-e2e && docker-compose --no-ansi exec -T postgres sh -c 'exec echo "CREATE DATABASE migrated; CREATE DATABASE latest;" | exec psql -U mmuser mattermost_test'
	@echo --- postgres: DB created

	cd mattermost-e2e && docker run --net mattermost-e2e_mm-test appropriate/curl:latest sh -c "until curl --max-time 5 --output - http://elasticsearch:9200; do echo waiting for elasticsearch; sleep 5; done;"
	@echo --- elasticsearch: confirmed running

	cd mattermost-e2e/app && docker build -t mattermost-e2e/app .
	# Would be nice to declare environment variables in a separate file.
	# However, use of `--env-file` does not work with `-d`.
	docker run -it -d --net mattermost-e2e_mm-test --name mattermost-e2e_app --rm -e MM_USERNAME=mmuser -e MM_PASSWORD=mmuser_password -e MM_DBNAME=mattermost --env MM_EMAILSETTINGS_SMTPSERVER=inbucket --env MM_EMAILSETTINGS_SMTPPORT=10025 --env MM_ELASTICSEARCHSETTINGS_CONNECTIONURL=http://elasticsearch:9200 --env MM_SQLSETTINGS_DATASOURCE="postgres://mmuser:mostest@postgres:5432/migrated?sslmode=disable&connect_timeout=10" --env MM_SQLSETTINGS_DRIVERNAME=postgres --env MM_SERVICESETTINGS_ALLOWEDUNTRUSTEDINTERNALCONNECTIONS="localhost 127.0.0.1 mattermost-e2e_webhook" -v `pwd`:`pwd` -p 8000:8000 mattermost-e2e/app:latest
	docker run --net mattermost-e2e_mm-test --rm appropriate/curl:latest sh -c "until curl --max-time 5 --output - http://mattermost-e2e_app:8000; do echo waiting for mattermost-e2e_app; sleep 5; done;"
	@echo --- app: started running

	# EE license should be at `mattermost-cypress-docker/mattermost-e2e/app/mm-license.txt`
	cd mattermost-e2e/app && docker exec mattermost-e2e_app mattermost license upload /mm-license.txt
	@echo --- app: uploaded EE license

	docker exec mattermost-e2e_app mattermost config set TeamSettings.MaxUsersPerTeam 1000
	@echo --- app: updated system config

	docker exec mattermost-e2e_app mattermost sampledata -w 4 -u 60 --deactivated-users=200
	@echo --- app: loaded test data

	cp -r mattermost-webapp/e2e mattermost-e2e/webhook
	cd mattermost-e2e/webhook && docker build -t mattermost-e2e/webhook .
	docker run -it -d --net mattermost-e2e_mm-test --name mattermost-e2e_webhook --rm mattermost-e2e/webhook:latest
	docker run --net mattermost-e2e_mm-test --rm appropriate/curl:latest sh -c "until curl --max-time 5 --output - http://mattermost-e2e_webhook:3000; do echo waiting for app; sleep 5; done;"
	@echo --- webhook: started running

	cp -r mattermost-webapp/e2e mattermost-e2e/cypress
	cd mattermost-e2e/cypress && docker build -t mattermost-e2e/cypress .
	docker run --net mattermost-e2e_mm-test --rm --name mattermost-e2e_cypress -e CYPRESS_baseUrl=http://mattermost-e2e_app:8000 -e CYPRESS_webhookBaseUrl=http://mattermost-e2e_webhook:3000 mattermost-e2e/cypress

stop:
	cd mattermost-e2e && docker-compose stop
	@echo --- Docker containers: stopped

clean:
	cd mattermost-e2e && docker-compose down -v
	cd mattermost-e2e && docker-compose rm -v
	@echo --- Docker containers: cleaned up

app-stop:
	docker stop mattermost-e2e_app

webhook-stop:
	docker stop mattermost-e2e_webhook

pull-webapp:
	git submodule init && git submodule update

move-cypress-e2e:
	cp -r mattermost-webapp/e2e mattermost-e2e/cypress

move-webhook-src:
	cp -r mattermost-webapp/e2e mattermost-e2e/webhook/src
