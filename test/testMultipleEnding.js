require([
  '../tree' // In development, latest version
  , 'stree' // More stable one, proven to be working
  //, '../lib/jquery/dist/jquery.min'
], function(tree, stree, $) {
  // var childrenCont = [
  //   {
  //     name: '1'
  //     , children: [
  //       {_run:false, _parallel:true, _done:false, _timedOut:false}
  //       , {_run:false, _parallel:true, _done:false, _timedOut:false}
  //     ], expect: 0
  //   }, {
  //     name: '2'
  //     , children: [
  //       {_run:true, _parallel:true, _done:false, _timedOut:false}
  //       , {_run:false, _parallel:true, _done:false, _timedOut:false}
  //     ], expect: 1
  //   }, {
  //     name: '3'
  //     , children: [
  //       {_run:true, _parallel:true, _done:false, _timedOut:false}
  //       , {_run:true, _parallel:true, _done:false, _timedOut:false}
  //     ], expect: 'wait'
  //   }, {
  //     name: '4'
  //     , children: [
  //       {_run:true, _parallel:true, _done:true, _timedOut:false}
  //       , {_run:true, _parallel:true, _done:false, _timedOut:false}
  //     ], expect: 'wait'
  //   }, {
  //     name: '5'
  //     , children: [
  //       {_run:true, _parallel:true, _done:false, _timedOut:false}
  //       , {_run:true, _parallel:true, _done:true, _timedOut:false}
  //     ], expect: 'wait'
  //   }, {
  //     name: '6'
  //     , children: [
  //       {_run:true, _parallel:true, _done:true, _timedOut:false}
  //       , {_run:true, _parallel:true, _done:true, _timedOut:false}
  //     ], expect: 'up'
  //   }
  // ]
  // for (var i = 0; i < childrenCont.length; i++) {
  //   var c = childrenCont[i]
  //   // fake complete tree object!
  //   for (var i2 = 0; i2 < c.children.length; i2++) {
  //     c.children[i2].cfg = function(str) {
  //       if (str == 'parallel') {
  //         return this._parallel
  //       }else{
  //         return undefined
  //       }
  //     }
  //   }
  //   console.log('running', c.name)
  //   stree(tree._next._pcik(c.children)).eql(c.expect)
  // }
  tree.heritable.cfg('parallel', true)
  tree.branch('1===', function(tree) {
    //console.log('ASDASD')
    tree.branch('2===', function(tree) {
      tree.cfg('timeout', 300)
      console.log("---------1")
      setTimeout(function() {
        tree.done(0)
      },5000)
    })
    tree.branch('3===', function(tree) {
      console.log("---------2")
      tree.done(0)
    })
    tree.done(0)
  })
  tree.done(0)
})

[
  {
    name: '1'
    , children: [
      {_run:false, _parallel:true, _done:false, _timedOut:false}
      , {_run:false, _parallel:true, _done:false, _timedOut:false}
    ], expect: 0
  }, {
    name: 'end'
    , children: [
      {_run:true, _parallel:true, _done:true, _timedOut:false}
      , {_run:true, _parallel:true, _done:true, _timedOut:false}
    ], expect: 'up'
  }
]