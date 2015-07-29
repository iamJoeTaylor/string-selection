NPMBIN = $(shell npm bin)
DIST = dist/string-selection.js

all: clean dist

dist: $(DIST)

$(DIST): lib/string-selection.js
	@mkdir -p $(shell dirname $(DIST))
	$(NPMBIN)/babel -o dist/string-selection.js -m umd --module-id Selection lib/string-selection.js

test: clean dist
	mocha

clean:
	rm -f $(DIST)

.PHONY: clean test
