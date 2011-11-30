require([
  '../tree' // In development, latest version
  , 'stree' // More stable one, proven to be working
  //, '../lib/jquery/dist/jquery.min'
], function(tree, stree, $) {

  stree.expect(0)
  //stree.branch('asdasd', function(stree) {
  //  stree.expect(0)
  //  var pick = tree._next._pick
  //  var childrenCont = [
  //    {
  //      name: 'childrenEmpty'
  //      , children: [
  //        {_run:true, _parallel:true, _done:false, _timedOut:false}
  //        , {_run:false, _parallel:true, _done:false, _timedOut:false}
  //      ], expect: 1
  //    }
  //  ]
  //  // run these tests!
  //  for (var i = 0; i < childrenCont.length; i++) {
  //    var c = childrenCont[i]
  //    // fake complete tree object!
  //    for (var i2 = 0; i2 < c.children.length; i2++) {
  //      c.children[i2].cfg = function(str) {
  //        if (str == 'parallel') {
  //          return this._parallel
  //        }else{
  //          return undefined
  //        }
  //      }
  //    }
  //    console.log('running', c.name)
  //    stree(pick(c.children)).eql(c.expect)
  //  }
  //  stree.done(0)
  //})
  stree.branch('integr', function(stree) {
    stree.expect(20)
    var count = 0
    tree.heritable.cfg('parallel', true)
    tree.branch('1', function(tree) {
      stree(++count).eql(2)
      setTimeout(function() {
        tree.done(0)
        stree.done(4)
      },100)
    })
    tree.branch('2', function(tree) {
      stree(++count).eql(3)
      tree.done(0)
    })
    stree(++count).eql(1)
    stree(tree._children[0]._run).eql(false)
    stree(tree._children[0].cfg('parallel')).eql(true)
    stree(tree._children[0]._done).eql(false)
    stree(tree._children[0]._timedOut).eql(false)
    stree(tree._children[1]._run).eql(false)
    stree(tree._children[1].cfg('parallel')).eql(true)
    stree(tree._children[1]._done).eql(false)
    stree(tree._children[1]._timedOut).eql(false)
    tree.done(0)
    stree(tree._children[0]._run).eql(true)
    stree(tree._children[0].cfg('parallel')).eql(true)
    stree(tree._children[0]._done).eql(false)
    stree(tree._children[0]._timedOut).eql(false)
    stree(tree._children[1]._run).eql(true)
    stree(tree._children[1].cfg('parallel')).eql(true)
    stree(tree._children[1]._done).eql(true)
    stree(tree._children[1]._timedOut).eql(false)
    stree(++count).eql(4)
  })
  stree.done(0)
})
function extract (t) {
  return {run: t._run
    , parallel: t.cfg('parallel')
    , done: t._done
    , timedOut: t._timedOut}
}