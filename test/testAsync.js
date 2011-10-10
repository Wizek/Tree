require([
  '../tree' // In development, latest version
  , 'stree' // More stable one, proven to be working
], function(tree, stree) {
  stree._name = 'STREE top lev'
  stree.expect(0)
  tree.expect(0)
  stree.branch('STREE tree trunk-specific', function(stree) {
    stree.expect(2)
    stree(tree._parent).type('undefined')
    stree(tree._name).eql('trunk')
    stree.done()
  })
  stree.branch('STREE branches', function(stree) {
    stree.expect(0)
    stree.branch('STREE run only once', function(stree) {
      var onceCount = 0
      stree.expect(1)
      tree.branch('once', function(tree) {
        tree.expect(0)
        stree(++onceCount).eql(1)
        tree.done()
        stree.done()
      })
    })
    stree.branch('STREE parents', function(stree) {
      stree.expect(2)
      tree.branch('async', function(tree) {
        //console.log(tree._helpers.display(tree))
        tree.expect(0)
        stree(tree._parent).type('function')
        stree(tree._parent._parent).type('undefined')
        tree.done()
        stree.done()
      })
    })
    stree.branch('STREE async handling', function(stree) {
      stree.expect(0)
      stree.branch('STREE unnamed', function(stree) {
        stree.expect(12)
        tree.branch('b capsule', function(tree) {
          tree.expect(0)
          tree.branch('b1', function(tree) {
            tree.expect(0)
            tree.done()
          })
          tree.branch('b2', function(tree) {
          })
          tree.branch('b3', function(tree) {
          })
          stree(tree._children[0]._run).eql(false)
          stree(tree._children[0]._done).eql(false)
          stree(tree._children[1]._run).eql(false)
          stree(tree._children[1]._done).eql(false)
          stree(tree._children[2]._run).eql(false)
          stree(tree._children[2]._done).eql(false)
          tree.done() // this gets to run them
          stree(tree._children[0]._run).eql(true)
          stree(tree._children[0]._done).eql(true)
          stree(tree._children[1]._run).eql(true)
          stree(tree._children[1]._done).eql(false)
          stree(tree._children[2]._run).eql(false)
          stree(tree._children[2]._done).eql(false)
          // do some manual cleanup
          tree._children[1]._done = true
          tree._children[2]._run = true
          tree._children[2]._done = true
          tree._next()
          stree.done()
        })
      })
      stree.branch('STREE varsity order', function(stree) {
        stree.expect(25)
        var counter = 0
        var asyncWaitTime = 60
        tree.branch('order test capsule', function(tree) {
          tree.expect(0)
          stree(++counter).eql(1)
          tree.branch('async branch 0', function(tree) {
            tree.expect(0)
            stree(++counter).eql(3)
            tree.branch('async branch 1', function(tree) {
              stree(++counter).eql(6)
              tree.expect(0)
              tree.branch('async branch 2', function(tree) {
                stree(++counter).eql(8)
                tree.expect(0)
                setTimeout(function() {
                  stree(++counter).eql(9)
                  tree.done()
                }, asyncWaitTime)
              })
              setTimeout(function() {
                stree(++counter).eql(7)
                tree.done()
              }, asyncWaitTime)
            })
            tree.branch('async branch 3', function(tree) {
              stree(++counter).eql(10)
              tree.expect(0)
              tree.branch('async branch 4', function(tree) {
                stree(++counter).eql(12)
                tree.expect(0)
                tree.branch('async branch 5', function(tree) {
                  stree(++counter).eql(14)
                  tree.expect(0)
                  setTimeout(function() {
                    stree(++counter).eql(15)
                    tree.done()
                  }, asyncWaitTime)
                })
                setTimeout(function() {
                  stree(++counter).eql(13)
                  tree.done()
                }, asyncWaitTime)
              })
              setTimeout(function() {
                stree(++counter).eql(11)
                tree.done()
              }, asyncWaitTime)
            })
            tree.branch('async branch 8', function(tree) {
              stree(++counter).eql(16)
              tree.expect(0)
              tree.branch('async branch 9', function(tree) {
                stree(++counter).eql(18)
                tree.expect(0)
                tree.branch('async branch 10', function(tree) {
                  stree(++counter).eql(20)
                  tree.expect(0)
                  setTimeout(function() {
                    stree(++counter).eql(21)
                    tree.done()
                  }, asyncWaitTime)
                })
                tree.branch('async branch 11', function(tree) {
                  stree(++counter).eql(22)
                  tree.expect(0)
                  setTimeout(function() {
                    stree(++counter).eql(23)
                    tree.done()
                  }, asyncWaitTime)
                })
                setTimeout(function() {
                  stree(++counter).eql(19)
                  tree.done()
                }, asyncWaitTime)
              })
              tree.branch('async branch 12', function(tree) {
                stree(++counter).eql(24)
                tree.expect(0)
                setTimeout(function() {
                  stree(++counter).eql(25)
                  tree.done()
                  stree.done()
                }, asyncWaitTime)
              })
              setTimeout(function() {
                stree(++counter).eql(17)
                tree.done()
              }, asyncWaitTime)
            })
            stree(++counter).eql(4)
            setTimeout(function() {
              stree(++counter).eql(5)
              tree.done()
            }, asyncWaitTime)
          })
          stree(++counter).eql(2)
          tree.done()
        })
      })
      stree.branch('STREE tomeout', function(stree) {
        stree.expect(12)
        tree.branch('timing out', function(tree) {
          tree.expect(0)
          tree.branch('I time in', function(tree) {
            tree.expect(0)
            setTimeout(function() {
              tree.done(0)
            }, 100)
          })
          stree(tree._children[0]._run).eql(false)
          stree(tree._children[0]._done).eql(false)
          stree(tree._children[0]._timedOut).eql(false)
          setTimeout(function() {
            stree(tree._children[0]._run).eql(true)
            stree(tree._children[0]._done).eql(false)
            stree(tree._children[0]._timedOut).eql(false)
          }, 50)
          setTimeout(function() {
            stree(tree._children[0]._run).eql(true)
            stree(tree._children[0]._done).eql(true)
            stree(tree._children[0]._timedOut).eql(false)
          }, 150)
          tree.branch('I time out', function(tree) {})
          setTimeout(function() {
            stree(tree._children[1]._run).eql(true)
            stree(tree._children[1]._done).eql(false)
            stree(tree._children[1]._timedOut).eql(true)
            //tree._next()
            stree.done()
          }, 1200)
          tree.done()
        })
        stree.branch('STREE variable timeout', function(stree) {
          stree.done()
        })
      })
      stree.done()
    })
    stree.done()
  })
  tree.done()
  stree.done()
})