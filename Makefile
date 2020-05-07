.PHONY: build

build: setup
	cd mattermost-e2e && docker-compose build
	@echo --- All services built

	cd mattermost-e2e/cypress && docker build -t mattermost-e2e/cypress .
	@echo --- Cypress image built

start:
	cd mattermost-e2e && docker-compose up -d
	@echo --- Dependencies started

	cd mattermost-e2e && cat test-data/ldap-data.ldif | docker-compose --no-ansi exec -T openldap bash -c 'ldapadd -x -D "cn=admin,dc=mm,dc=test,dc=com" -w mostest';
	@echo --- LDAP users added

	cd mattermost-e2e && docker-compose --no-ansi exec -T minio sh -c 'mkdir -p /data/mattermost-test';
	@echo --- minio: created "/data/mattermost-test"

	cd mattermost-e2e && docker-compose --no-ansi ps
	@echo --- See state of containers

	cd mattermost-e2e && docker run --net mattermost-e2e_mm-test appropriate/curl:latest sh -c "until curl --max-time 5 --output - http://elasticsearch:9200; do echo waiting for elasticsearch; sleep 5; done;"
	@echo --- elasticsearch: confirmed running

	docker run --net mattermost-e2e_mm-test --rm appropriate/curl:latest sh -c "until curl --max-time 5 --output - http://app:8000; do echo waiting for mattermost-e2e_app; sleep 5; done;"
	@echo --- app: confirmed running

	# EE license should be at `mattermost-cypress-docker/mattermost-e2e/app/mm-license.txt` before docker image build
	cd mattermost-e2e && docker-compose exec app mattermost license upload /mm-license.txt
	@echo --- app: uploaded EE license

	cd mattermost-e2e && docker-compose exec app mattermost sampledata -w 4 -u 60 --deactivated-users=200
	@echo --- app: loaded test data

	docker run --net mattermost-e2e_mm-test --rm appropriate/curl:latest sh -c "until curl --max-time 5 --output - http://webhook:3000; do echo waiting for webhook; sleep 5; done;"
	@echo --- webhook: confirmed running

	# docker run --net mattermost-e2e_mm-test --rm --name mattermost-e2e_cypress -e CYPRESS_baseUrl=http://app:8000 -e CYPRESS_webhookBaseUrl=http://webhook:3000 mattermost-e2e/cypress
	# @echo --- Cypress tests: completed

stop:
	cd mattermost-e2e && docker-compose down -v
	cd mattermost-e2e && docker-compose rm -v
	@echo --- Docker containers: cleaned up

	rm -rf mattermost-e2e/cypress/e2e
	rm -rf mattermost-e2e/webhook/e2e
	rm mattermost-e2e/app/mm-license.txt
	@echo --- Files and license: removed from required directories

setup:
	cp -r mm-license.txt mattermost-e2e/app/mm-license.txt
	cp -r e2e mattermost-e2e/webhook
	cp -r e2e mattermost-e2e/cypress

	# Allow the subnet address set on docker-compose network
	# On Mac, command should start as "sed -i '' 's|..."
	sed -i 's|"AllowedUntrustedInternalConnections": "localhost"|"AllowedUntrustedInternalConnections": "localhost 192.168.16.0/20"|g' mattermost-e2e/cypress/e2e/cypress/fixtures/partial_default_config.json

	@echo --- Files and license: updated and copied to required directories

app-stop:
	docker stop mattermost-e2e_app

webhook-stop:
	docker stop mattermost-e2e_webhook

copy-webapp-e2e:
	cp -r ../mattermost-webapp/e2e .

copy-license:
	cp -r ../mm-license.txt .
