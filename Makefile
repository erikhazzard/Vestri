HR= ==================================================
MOCHA_OPTS= --check-leaks
REPORTER = spec

gulp:
	while [ 1 ]; do gulp watch; sleep 3; done

loadData: 
	node scripts/empty-and-load-blog-posts.js

clearData:
	mongo fivereddit --eval "db.dropDatabase()"
	redis-cli flushdb
