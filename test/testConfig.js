require([
  '../tree' // In development, latest version
  , 'stree' // More stable one, proven to be working
], function(tree, stree) {
  stree.expect(0)
  tree.expect(0)
  
  stree._name = stree._name || 'top'

  stree.branch('STREE config', function(stree) {
    stree.expect(0)
    /*\
     *  Usecases:
     *         _heritable___oneLevel___!spec_
     *  read  |___________|__________|_______|
     *  write |___________|__________|_______|
     *  
     *  tree.config('prop')
     *  tree.config({prop:'value'})
     *  tree.config('prop','value')
     *  tree.heritable.config('prop')
     *  tree.oneLevel.config('prop')
     *  tree.heritalbe.config().prop
     *  tree.oneLevel.config().prop
     *  tree.heritalbe.config({prop:'value'})
     *  tree.oneLevel.config({prop:'value'})
     *  tree.heritalbe.config('prop','value')
     *  tree.oneLevel.config('prop','value')
    \*/

    stree.branch('STREE morph', function(stree) {
      stree.expect(6)
      stree(tree.config._morph).type('function')
      stree(tree.config._morph()).eql(null)
      stree(tree.config._morph(1)).eql(null)
      stree(tree.config._morph('a')).eql('a')
      stree(tree.config._morph('a','b')).deepEql({a:'b'})
      stree(tree.config._morph({c:'d'})).deepEql({c:'d'})
      stree.done()
    })

    stree.branch('STREE config engine', function(stree) {
      stree.expect(44)
      tree.branch('config container', function(tree) {
        tree.expect(0)
        // engine
        stree(tree.config).type('function')
        stree(tree.heritable.config).type('function')
        stree(tree.oneLevel.config).type('function')
        stree(tree.config()).type('object')
        stree(tree.config().a).eql(undefined)
        stree(tree.config({a:1}).a).eql(1)
        stree(tree.config().a).eql(1)
        stree(tree.config({a:2}).a).eql(2)
        stree(tree.config().a).eql(2)

        stree(tree.heritable.config({b:35}).a).eql(undefined)
        stree(tree.config({x:1}).a).eql(2)
        stree(tree.oneLevel.config({y:2}).a).eql(2)
        stree(tree.config().b).eql(35)
        stree(tree.config({z:1}).z).eql(1)
        stree(tree.config('z')).eql(1)
        
        stree(tree.config({z:0}).z).eql(0)
        stree(tree.config('z')).eql(0)
        stree(tree.config({z:null}).z).eql(null)
        stree(tree.config('z')).eql(null)
        stree(tree.config({z:undefined}).z).eql(undefined)
        stree(tree.config('z')).eql(undefined)
        stree(tree.config({z:NaN}).z).eql(NaN)
        stree(tree.config('z')).eql(NaN)
        
        tree.oneLevel.config({c:'only this'})
        tree.heritable.config({c:'inherited'})
        stree(tree.config('c')).eql('only this')
        stree(tree.heritable.config('c')).eql('inherited')
        stree(tree.oneLevel.config('c')).eql('only this')
        stree(tree.heritable.config().c).eql('inherited')
        stree(tree.oneLevel.config().c).eql('only this')

        tree.branch('inherited?', function(tree) {
          tree.expect(0)
          stree(tree.config('a')).eql(undefined)
          stree(tree.config('b')).eql(35)
          stree(tree.config('c')).eql('inherited')
          stree(tree.heritable.config('c')).eql('inherited')
          stree(tree.oneLevel.config('c')).eql(undefined)
          stree(tree.heritable.config().c).eql('inherited')
          stree(tree.oneLevel.config().c).eql(undefined)
          tree.config({d:1})
          tree.heritable.config({e:1})
          tree.branch('and here?', function(tree) {
            tree.expect(0)
            stree(tree.config('a')).eql(undefined)
            stree(tree.config('b')).eql(35)
            stree(tree.config('c')).eql('inherited')
            stree(tree.heritable.config('c')).eql('inherited')
            stree(tree.oneLevel.config('c')).eql(undefined)
            stree(tree.heritable.config().c).eql('inherited')
            stree(tree.oneLevel.config().c).eql(undefined)
            stree(tree.config('d')).eql(undefined)
            stree(tree.config('e')).eql(1)
            tree.done()
            stree.done()
          })
          tree.done()
        })
        tree.done()
      })
    })
    stree.branch('STREE trunk config', function(stree) {
      stree.expect(1)
      stree(tree.config()).deepEql({
        name:'trunk'
        , expect:-1
        , parallel:false
        , timeout:1000
      })
      stree.done()
    })
    // default trunk
    stree.done()
  })
  //stree.branch('STREE branching', function(stree) {
  //  //stree.branch('STREE async handling')
  //})

  tree.done()
  stree.done()
  setTimeout(function() {
    tree._helpers._display(stree)
  },2000)
})