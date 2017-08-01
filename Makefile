.PHONY: test

build:
	@docker pull mongo:latest
	@docker build -t wilkmaia/zssn .

docker:
	@docker-compose up -d zssn

local:
	@docker-compose up -d mongo
	@node server.js

test:
	@docker-compose up test
