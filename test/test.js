require(['../tree', '../lib/jquery/dist/jquery.js']
, function(tree, $) {
  // Super Tree instance for testing the test framework.
  stree = tree._debugInstance()
  stree(tree._debugMode).eql(false)
  stree(stree._debugMode).eql(true)
  stree.branch('STREE Top level', function(stree) {
    stree.expect(-1)
    stree(tree._debugMode).eql(false)
    stree(stree._debugMode).eql(true)
    stree.branch('STREE debug', function(stree) {
      stree(tree._debugMode).eql(false)
      stree(stree._debugMode).eql(true)
    })

    //tree._init()
    stree(tree).type('function')
    stree(tree.config).type('function')
    stree(tree.branch).type('function')
    stree(tree.expect).type('function')
    stree(tree.done).type('function')

    stree.branch('STREE branching', function(stree) {
      tree.branch('Some name', function(tree) {
        stree(tree._name).eql('Some name')
        stree(tree._children).type('array')
        stree(tree._children.length).eql(0)
        tree.branch('Some other name', function(tree) {
          stree(tree._name).eql('Some other name')
          stree(tree._parent._name).eql('Some name')
        })
        stree(tree._children.length).eql(1)
        stree(tree._children[0]._name).eql('Some other name')
      })      
    })

    stree.branch('STREE formateer', function(stree) {
      tree.branch('formateer!', function(tree) {
        stree(tree._formateer).type('function')
        var frm = tree._formateer
        /*\
         *  short format
        \*/
        stree( frm(1) ).eql('1')
        stree( frm('string') ).eql("'string'")
        stree( frm("'string'") ).eql('"\'string\'"')
        stree( frm('"string"') ).eql("'\"string\"'")
        stree( frm('\'""') ).eql("'\\'\"\"'")
        stree( frm("\"''") ).eql('"\\"\'\'"')
        stree( frm('"\'"\'') ).eql("'\"\\'\"\\''")
        stree( frm(true) ).eql('true')
        stree( frm(false) ).eql('false')
        stree( frm(function() {}) ).eql('fn(){…}')
        stree( frm({a:1}) ).eql('{…}')
        stree( frm([1,2,3]) ).eql('[…]')
        /*\
         *  Long format
        \*/
        // yet to come
      })
    })

    stree.branch('STREE announcer-interception', function(stree) {
      var stash = tree._announcer
      var name = 'announce!'
      tree.branch(name, function(tree) {
        stree(tree._announcer).type('function')
        tree._announcer = function(obj) {
          stree(obj).type('object')
          stree(obj.pass).eql(true)
          stree(obj.msg).eql('1 === 1')
          stree(obj.name).eql(name)
        }
        tree(1).eql(1)
        tree._announcer = function(obj) {
          stree(obj).type('object')
          stree(obj.pass).eql(false)
          stree(obj.msg).eql('1 !== 2')
          stree(obj.name).eql(name)
        }
        tree(1).eql(2)

      })
      tree._announcer = stash
    })

    stree.branch('STREE expectations', function(stree) {
      tree.branch('none', function(tree) {
        stree(tree._expect).eql(-1)
        tree.expect('string')
        stree(tree._expect).eql(-1)
        tree.expect(3.34)
        stree(tree._expect).eql(3.34)
        tree.expect(-422)
        stree(tree._expect).eql(-1)
        tree.expect(2)
        stree(tree._expect).eql(2)
        tree.expect(1)
        stree(tree._expect).eql(1)
        tree(1).eql(1)
        stree(tree._done).eql(false)
        tree.done()
        stree(tree._done).eql(true)
      })
      tree.branch('fulfill', function(tree) {
        var stash = tree._announcer
        tree.expect(1)
        tree('a').eql('a')
        tree._announcer = function(obj) {
          stree(obj.pass).eql(true)
          stree(obj.msg).eql('done.')
        }
        tree.done()
        tree._announcer = function(obj) {
          stree(obj.pass).eql(false)
          stree(obj.msg).eql('done called twice!')
        }
        tree._announcer = stash
        tree.done()
      })
      stree.done()
    })
    stree.branch('STREE testing asserts', function(stree) {
      var stash = tree._announcer
      stree.branch('STREE ok', function(stree) {
        stree.expect(10)
        stree(tree.ok).type('function')
        tree._announcer = function(obj) {
          stree(obj.pass).eql(true)
        }
        tree([]).ok()
        tree({}).ok()
        tree(function() {}).ok()
        tree(1).ok()
        tree('non-empty').ok()
        tree._announcer = function(obj) {
          stree(obj.pass).eql(false)
        }
        tree(null).ok()
        tree(0).ok()
        tree(undefined).ok()
        tree('').ok()
        stree.done()
      })
      stree.branch('STREE eql', function(stree) {
        stree.expect(4)
        stree(tree.eql).type('function')
        tree._announcer = function(obj) {
          stree(obj.pass).eql(true)
        }
        tree(1).eql(1)
        tree._announcer = function(obj) {
          stree(obj.pass).eql(false)
        }
        tree(1).eql(2)
        tree(1).eql('1')
        stree.done()
      })
      stree.branch('STREE equal', function(stree) {
        stree.expect(4)
        stree(tree.equal).type('function')
        tree._announcer = function(obj) {
          stree(obj.pass).eql(true)
        }
        tree(1).equal(1)
        tree(1).equal('1')
        tree._announcer = function(obj) {
          stree(obj.pass).eql(false)
        }
        tree(1).equal(2)
        stree.done()
      })
      tree._announcer = stash
      tree.done()
    })
    stree.done()
  })

  
  /*stree.branch('Branching', function(stree) {
    stree.expect(-1)
    stree.done()
  })

  stree(tree._assertCount).typeOf('number')

  // Functionality type tests
  stree(tree).typeOf('function')
  stree(tree.ok).typeOf('function')
  stree(tree.eql).typeOf('function')
  stree(tree.equal).typeOf('function')

  // Simple type tests
  stree( tree(123).typeOf('number') ).ok()
  stree( tree(0).typeOf('number') ).ok()
  stree( tree(NaN).typeOf('number') ).ok()

  stree( tree('string').typeOf('string') ).ok()
  stree( tree('').typeOf('string') ).ok()

  stree( tree(function(){}).typeOf('function') ).ok()

  stree( tree({}).typeOf('object') ).ok()
  stree( tree([]).typeOf('object') ).ok()
  stree( tree(null).typeOf('object') ).ok()

  stree( tree(true).typeOf('boolean') ).ok()
  stree( tree(false).typeOf('boolean') ).ok()

  stree( tree(undefined).typeOf('undefined') ).ok()

  stree(tree.isDone).eql(false)
  tree.done()*/
})