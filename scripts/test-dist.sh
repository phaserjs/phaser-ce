# Check the syntax of all the JS files (except wrappers) in the dist directory.

for f in dist/*.js dist/modules/*.js; do
    [[ $f == *intro* || $f == *outro* ]] && continue
    node --check "$f" || exit 1
done
