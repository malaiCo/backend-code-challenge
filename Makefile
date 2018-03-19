

init:
	npm install

start:
	docker-compose up --build 

test:
	npm test

import-data: init
	node tools/importer.js