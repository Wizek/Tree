require([
  '../tree' // In development, latest version
  , 'stree' // More stable one, proven to be working
], function(tree, stree) {
  stree.heritable.config('parallel',true)
  stree.branch('br1', function(stree) {
    stree.branch('br2', function(stree) {
      tree.branch('br3', function(tree) {
        
        stree.done(0)
        tree.done(0)
      })
    })
    stree.done(0)
  })
  stree.branch('br4', function(stree) {
    tree.branch('br5  ', function(tree) {
          
      stree.done(0)
      tree.done(0)
    })
  })
  stree.done(0)
  tree.done(0)
})