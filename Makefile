NPMBIN = $(shell npm bin)

all: clean dist

ESNEXT = find . -name '*.js' && $(NPMBIN)/esnext -o ../tmp $$(find . -name '*.js')

lib:
	cd lib && $(ESNEXT)

dist: lib
	mv tmp/string-selection.js dist/string-selection.js

test: clean dist
	mocha

clean_lib:
	cd tmp && find . -name '*.js' | xargs rm || true

clean_dist:
	cd dist && find . -name '*.js*' | xargs rm || true

clean: clean_dist clean_lib

.PHONY: clean_lib clean_test clean lib test
