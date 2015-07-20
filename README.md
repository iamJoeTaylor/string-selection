String Selection
----------------

Installation
============

```sh
# Install with NPM
$ npm install string-selection
# Install by copying the dist file.
$ git clone https://github.com/iamJoeTaylor/string-selection.git
$ cp string-selection/dist/string-selection.js path/to/vendor/string-selection.js
```

Usage
=====

### parseDescription

```javascript
  var desc = Selection.parseDescription('W|olver|ine');
  > {
  >   caret: { input: 'Wolverine', start: 1, end: 6 },
  >   affinity: null,
  >   value: 'Wolverine'
  > }
```

```javascript
  var desc = Selection.parseDescription('S<to|rm');
  > {
  >   caret: { input: 'Storm', start: 1, end: 3 },
  >   affinity: 0,
  >   value: 'Storm'
  > }
```

### printDescription

```javascript
  var desc = Selection.printDescription({
    caret: {
      start: 2,
      end: 2
    },
    affinity: null,
    value: 'Beast'
  });
  > 'Be|ast';
```

```javascript
  var desc = Selection.printDescription({
    caret: {
      start: 3,
      end: 6
    },
    affinity: 0,
    value: 'Kitty Pride'
  });
  > 'Kit<ty |Pride';
```
