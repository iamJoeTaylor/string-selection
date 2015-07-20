var expect = require("chai").expect;
var Selection = require('../dist/string-selection');

describe('Selection', function() {

  describe('parseDescription', function() {
    describe('with no caret', function() {
      it('throws an error', function() {
        try {
          Selection.parseDescription('Magneto');
          throw new Error('Should have thrown');
        } catch (ex) {
          expect(ex.message).to.match(/no caret found in description/);
        }
      });
    });

    describe('with no affinity', function() {
      it('knows when nothing is selected', function() {
        var desc = Selection.parseDescription('Wolverine|');
        expect(desc).to.eql({
          caret: { input: 'Wolverine', start: 9, end: 9 },
          affinity: null,
          value: 'Wolverine'
        });
      });

      it('knows when something is selected', function() {
        var desc = Selection.parseDescription('W|olver|ine');
        expect(desc).to.eql({
          caret: { input: 'Wolverine', start: 1, end: 6 },
          affinity: null,
          value: 'Wolverine'
        });
      });
    });

    describe('with affinity', function() {
      describe('right', function() {
        it('throws when only `>` is present', function() {
          try {
            Selection.parseDescription('Deadpool>');
            throw new Error('Should have thrown');
          } catch (ex) {
            expect(ex.message).to.match(/>. cannot be the start of a selection/);
          }
        });

        it('knows when something is selected', function() {
          var desc = Selection.parseDescription('De|adpo>ol');
          expect(desc).to.eql({
            caret: { input: 'Deadpool', start: 2, end: 6 },
            affinity: 1,
            value: 'Deadpool'
          });
        });
      });

      describe('left', function() {
        it('throws when only `<` is present', function() {
          try {
            Selection.parseDescription('<Storm');
            throw new Error('Should have thrown');
          } catch (ex) {
            expect(ex.message).to.match(/expected .|. to end the selection/);
          }
        });

        it('knows when something is selected', function() {
          var desc = Selection.parseDescription('S<to|rm');
          expect(desc).to.eql({
            caret: { input: 'Storm', start: 1, end: 3 },
            affinity: 0,
            value: 'Storm'
          });
        });
      });
    });

  });

  describe('printDescription', function() {
    describe('no affinity', function() {
      it('knows when nothing is selected', function() {
        var desc = Selection.printDescription({
          caret: {
            start: 2,
            end: 2
          },
          affinity: null,
          value: 'Beast'
        });
        expect(desc).to.equal('Be|ast');
      });

      it('knows when something is selected', function() {
        var desc = Selection.printDescription({
          caret: {
            start: 2,
            end: 5
          },
          affinity: null,
          value: 'Beast'
        });
        expect(desc).to.equal('Be|ast|');
      });
    });

    describe('with affinity', function() {
      describe('right', function() {
        it('throws when no base is present', function() {
          try {
            Selection.printDescription({
              caret: {
                start: 3,
                end: 3
              },
              affinity: 1,
              value: 'Jean'
            });
            throw new Error('Should have thrown');
          } catch (ex) {
            expect(ex.message).to.match(/cannot have directional selection without a selection/);
          }
        });

        it('knows when something is selected', function() {
          var desc = Selection.printDescription({
            caret: {
              start: 1,
              end: 3
            },
            affinity: 1,
            value: 'Jean'
          });
          expect(desc).to.equal('J|ea>n');
        });
      });

      describe('left', function() {
        it('throws when no base is present', function() {
          try {
            Selection.printDescription({
              caret: {
                start: 3,
                end: 3
              },
              affinity: 0,
              value: 'Kitty Pride'
            });
            throw new Error('Should have thrown');
          } catch (ex) {
            expect(ex.message).to.match(/cannot have directional selection without a selection/);
          }
        });

        it('knows when something is selected', function() {
          var desc = Selection.printDescription({
            caret: {
              start: 3,
              end: 6
            },
            affinity: 0,
            value: 'Kitty Pride'
          });
          expect(desc).to.equal('Kit<ty |Pride');
        });
      });
    });
  });

  describe('full cycle', function() {
    it('with printDescription first', function() {
      var data = {
        caret: {
          start: 3,
          end: 6,
          input: 'Psylocke'
        },
        affinity: 0,
        value: 'Psylocke'
      };
      var desc = Selection.printDescription(data);
      expect(Selection.parseDescription(desc)).to.eql(data);
    });

    it('with parseDescription first', function() {
      var desc = 'P|sy|locke';
      var data = Selection.parseDescription(desc);
      expect(Selection.printDescription(data)).to.equal(desc);
    });
  });
});
