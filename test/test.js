require(['../tree', 'https://ajax.googleapis.com/ajax/libs/jquery/1.6.2/jquery.min.js']
, function(tree, $) {
  // Instance for testing the test framework.
  stree = tree._debugInstance()
  stree.branch('STREE Top level', function(stree) {
    stree.expect(-1)

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

        stree(tree._done).eql(false)
        tree.done()
        stree(tree._done).eql(true)
      })
      tree.branch('fulfill', function(tree) {
        tree._announcer = function(obj) {
          stree(obj).deepEql({pass:false, msg:'fulfill: done called twice!'})
        }
        stree()
        tree.expect(1)
        tree('a').eql('a')
        tree.done()
        tree.done()
      })
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