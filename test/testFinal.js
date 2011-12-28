require([
  '../tree' // In development, latest warmest and crispiest version
], function(tree) {

  tree.heritable.config('timeout',5000)
  tree.heritable.config('parallel',true)

  tree.branch('2', function(tree) {
    tree.branch('3', function(tree) {
      tree(1).eql(1)
      setTimeout(function() {tree.done(1)}, ran())
    })
    tree.branch('4', function(tree) {
      tree(1).eql(1)
      setTimeout(function() {tree.done(1)}, ran())
    })
    setTimeout(function() {tree.done(0)}, ran())
  })
  tree.branch('2', function(tree) {
    tree.branch('3', function(tree) {
      tree(1).eql(1)
      setTimeout(function() {tree.done(1)}, ran())
    })
    tree.branch('4', function(tree) {
      tree(1).eql(1)
      setTimeout(function() {tree.done(1)}, ran())
    })
    setTimeout(function() {tree.done(0)}, ran())
  })
  tree.branch('2', function(tree) {
    tree.branch('3', function(tree) {
      tree(1).eql(1)
      setTimeout(function() {tree.done(1)}, ran())
    })
    tree.branch('4', function(tree) {
      tree(1).eql(1)
      setTimeout(function() {tree.done(1)}, ran())
    })
    setTimeout(function() {tree.done(0)}, ran())
  })
  tree.branch('2', function(tree) {
    tree.branch('3', function(tree) {
      tree(1).eql(1)
      setTimeout(function() {tree.done(1)}, ran())
    })
    tree.branch('4', function(tree) {
      tree(1).eql(1)
      setTimeout(function() {tree.done(1)}, ran())
    })
    setTimeout(function() {tree.done(0)}, ran())
  })
  tree.branch('2', function(tree) {
    tree.branch('3', function(tree) {
      tree(1).eql(1)
      setTimeout(function() {tree.done(1)}, ran())
    })
    tree.branch('4', function(tree) {
      tree(1).eql(1)
      setTimeout(function() {tree.done(1)}, ran())
    })
    setTimeout(function() {tree.done(0)}, ran())
  })

  tree([]).type('array')

  setTimeout(function() {tree.done(1)}, ran())
})
function ran () {
  var min = 1000
  var max = 1000
  return Math.random()*(max-min)+min
}