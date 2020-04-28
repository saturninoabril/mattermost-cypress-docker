.PHONY: docker-clean

docker-clean:
	docker system prune
	docker system prune -a
	docker images purge
	docker rm $(docker ps -a -f status=exited -q)
	docker volume prune

setup-server:
	cp ~/mm-license.txt dev-server/app/mm-license.txt
	docker-compose run app mattermost license upload /mm-license.txt

	docker-compose run app mattermost config set TeamSettings.MaxUsersPerTeam 1000
	docker-compose run app mattermost sampledata -w 4 -u 60 --deactivated-users=200

pull-webapp:
	git submodule init && git submodule update

move-cypress-e2e:
	cp -r mattermost-webapp/e2e dev-server/cypress

move-webhook-src:
	cp -r mattermost-webapp/e2e dev-server/webhook/src
