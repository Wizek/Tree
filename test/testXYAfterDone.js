require([
  '../tree' // In development, latest version
  //, 'stree' // More stable one, proven to be working
  //, '../lib/jquery/dist/jquery.min'
], function(tree, stree, $) {
  //setTimeout(function() {},10)
  setTimeout(function() {
    tree.branch('BRNCH', function(tree) {
      tree.done(0)
    })
  },10)
  tree.done(0)
})