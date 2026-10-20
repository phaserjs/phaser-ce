# Check the syntax of all the JS files in the build directory.

for f in build/*.js build/custom/*.js; do
	node --check "$f" || exit 1
done
