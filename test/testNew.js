require([
  '../tree' // In development, latest warmest and crispiest version
  , 'stree' // More stable one, proven to be working correctly
  , '../lib/jquery/dist/jquery.min'
], function(tree, stree) {

  // For debug purposes y'know
  window.stree = stree
  window.tree = tree
  tree._initDom(
    $('<iframe style="width:100%;margin-left:-4px">')
      .appendTo('body').contents().find('html')
  )
  // We want this to avoid double-shaw effect conflicting tree and stree libs
  stree.heritable.cfg('parallel', true)

  stree.branch('trunk specific', function(stree) {
    stree(tree).type('function')
    stree(tree.config).type('function')
    stree(tree.branch).type('function')
    stree(tree.expect).type('function')
    stree(tree.done).type('function')
    // stree(tree.note).type('function')
    stree.done(5)
  })

  stree.branch('virgo', function(stree) {
    tree.branch('empty', function(tree) {tree.done(0)})
    stree(tree._children.length).not.eql(0)
    var tree2 = tree._virgoTreeInstance()
    var tree3 = tree._virgoTreeInstance()
    stree(tree3._children.length).eql(0)
    tree3.branch('empty', function(tree) {tree.done(0)})
    stree(tree._children.length).not.eql(0)
    stree(tree3._children.length).eql(1)
    stree(tree2._children.length).eql(0)
    stree.done(5)
  })

  stree.branch('helpers', function(stree) {
    stree.branch('templater', function(stree) {
      var tpl = tree._helpers._templater
      stree(tpl).type('function')
      // Malformatted input
      stree( tpl('aaa',{bar:12}) ).eql('aaa')
      stree( tpl('{{ foo  } }',{foo:'1'}) ).eql('{{ foo  } }')
      stree( tpl('{{foo}',{foo:'1'}) ).eql('{{foo}')
      stree( tpl('{foo}',{foo:'1'}) ).eql('{foo}')
      // various input
      stree( tpl('{{bar}}',{bar:12}) ).eql('12')
      stree( tpl('{{foo}}asd',{foo:'dd'}) ).eql('ddasd')
      stree( tpl('{{12}}dd',{'12':'dda'}) ).eql('ddadd')
      stree( tpl('{{foo }}',{foo:'1'}) ).eql('1')
      stree( tpl('{{ foo}}',{foo:'1'}) ).eql('1')
      stree( tpl('{{ foo  }}',{foo:'1'}) ).eql('1')
      stree( tpl('1{{2}}3',{'2':'4'}) ).eql('143')
      stree( tpl('1{{a}}{{b}}4',{a:1,b:2}) ).eql('1124')
      stree( tpl('1{{a}} {{b}}4',{a:1,b:2}) ).eql('11 24')
      stree( tpl('1{{a}} {{b}}4',{b:2}) ).eql('1 24')
      stree( tpl('1{{a}} {{b}}4',{}) ).eql('1 4')
      stree( tpl('1{{a}} {{b}}4') ).eql('1 4')
      // If exists
      stree( tpl('1{{#a}}2{{/a}}3', {}) ).eql('13')
      stree( tpl('1{{#a}}2{{/a}}3', {a:false}) ).eql('13')
      stree( tpl('1{{#a}}2{{/a}}3', {a:true}) ).eql('123')
      stree( tpl('1{{#a}}{{a}} {{/a}}3', {a:'aa'}) ).eql('1aa 3')
      // If doesn't exist
      stree( tpl('1{{^a}}2{{/a}}3', {}) ).eql('123')
      stree( tpl('1{{^a}}2{{/a}}3', {a:false}) ).eql('123')
      stree( tpl('1{{^a}}2{{/a}}3', {a:true}) ).eql('13')
      stree(tpl).throws()
      stree(function() {tpl('a')}).not.throws()
      stree.done(26)
    })
    stree.branch('formateer', function(stree) {
      var frm = tree._helpers._formateer
      stree(frm).type('function')
      /*\
       *  short format
      \*/
      stree( frm(1) ).eql('1')
      stree( frm(-32) ).eql('-32')
      stree( frm(99.9) ).eql('99.9')
      stree( frm(1e+99) ).eql('1e+99')
      stree( frm(NaN) ).eql('NaN')
      stree( frm(Infinity) ).eql('Infinity')
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
      stree( frm(null) ).eql('null')
      stree( frm(undefined) ).eql('undefined')
      /*\
       *  Long format
      \*/
      // yet to come
      stree.done(20)
    })
    stree.branch('config', function(stree) {
      
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
      stree.branch('morph', function(stree) {
        stree.expect(6)
        stree(tree.config._morph).type('function')
        stree(tree.config._morph()).eql(null)
        stree(tree.config._morph(1)).eql(null)
        stree(tree.config._morph('a')).eql('a')
        stree(tree.config._morph('a','b')).deepEql({a:'b'})
        stree(tree.config._morph({c:'d'})).deepEql({c:'d'})
        stree.done()
      })
      stree.branch('config engine', function(stree) {
        //debugger
        /*tree.branch('config container', function(tree) {
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
              stree(tree.config('a')).eql(undefined)
              stree(tree.config('b')).eql(35)
              stree(tree.config('c')).eql('inherited')
              stree(tree.heritable.config('c')).eql('inherited')
              stree(tree.oneLevel.config('c')).eql(undefined)
              stree(tree.heritable.config().c).eql('inherited')
              stree(tree.oneLevel.config().c).eql(undefined)
              stree(tree.config('d')).eql(undefined)
              stree(tree.config('e')).eql(1)
              stree.done(44)
              tree.done(0)
            })
            tree.done(0)
          })
          tree.done(0)
        })*/
        stree.done(0)
        //tree.done(0)
      })
      stree.branch('trunk config', function(stree) {
        console.log(tree.config())
        stree(tree.config()).deepEql({
          name:'trunk'
          , expect:-1
          , parallel:null
          , timeout:1000
        })
        stree.done(1)
      })
      // default trunk
      stree.done()
    })
    stree.branch('// deep extend', function(stree) {
      
      stree.done(0)
    })
    stree.done(0)
  })
  
  stree.branch('asserts', function(stree) {
    stree.branch('ok', function(stree) {
      stree(tree._asserts.ok).type('function')
      stree(tree.ok).type('function')
      // passes
      stree(tree._asserts.ok({act:true}).pass).eql(true)
      stree(tree._asserts.ok({act:1}).pass).eql(true)
      stree(tree._asserts.ok({act:2}).act).eql(2)
      stree(tree._asserts.ok({act:'non-empty'}).pass).eql(true)
      stree(tree._asserts.ok({act:[]}).pass).eql(true)
      stree(tree._asserts.ok({act:{}}).pass).eql(true)
      stree(tree._asserts.ok({act:function(){}}).pass).eql(true)
      // fails
      stree(tree._asserts.ok({act:false}).pass).eql(false)
      stree(tree._asserts.ok({act:0}).pass).eql(false)
      stree(tree._asserts.ok({act:''}).pass).eql(false)
      stree(tree._asserts.ok({act:NaN}).pass).eql(false)
      stree(tree._asserts.ok({act:null}).pass).eql(false)
      stree(tree._asserts.ok({act:undefined}).pass).eql(false)
      stree(tree._asserts.ok({act:undefined}).act).eql(undefined)
      stree.done(16)
    })
    stree.branch('type', function(stree) {
      stree(tree._asserts.type).type('function')
      stree(tree.type).type('function')
      // passes
      stree(tree._asserts.type({act:'1',exp:'string'}).pass).eql(true)
      stree(tree._asserts.type({act:null,exp:'object'}).pass).eql(true)
      stree(tree._asserts.type({act:[],exp:'array'}).pass).eql(true)
      stree(tree._asserts.type({act:[],exp:'object'}).pass).eql(true)
      // fails
      stree(tree._asserts.type({act:1,exp:'string'}).pass).eql(false)
      stree(tree._asserts.type({act:{},exp:'array'}).pass).eql(false)
      stree.done(8)
    })
    stree.branch('eql', function(stree) {
      stree(tree._asserts.eql).type('function')
      stree(tree.eql).type('function')
      // standard
      // passes
      stree(tree._asserts.eql({act:1,exp:1}).pass).eql(true)
      // fails
      stree(tree._asserts.eql({act:1,exp:'1'}).pass).eql(false)
      stree(tree._asserts.eql({act:1,exp:2}).pass).eql(false)
      // extended
      stree(tree._asserts.eql({act:NaN,exp:NaN}).pass).eql(true)
      stree(tree._asserts.eql({act:NaN,exp:1}).pass).eql(false)
      stree(tree._asserts.eql({act:NaN,exp:'NaN'}).pass).eql(false)
      stree(tree._asserts.eql({act:1,exp:NaN}).pass).eql(false)
      stree(tree._asserts.eql({act:'NaN',exp:NaN}).pass).eql(false)
      stree.done(10)
    })
    stree.branch('equal', function(stree) {
      stree(tree._asserts.equal).type('function')
      stree(tree.equal).type('function')
      // passes
      stree(tree._asserts.equal({act:1,exp:1}).pass).eql(true)
      stree(tree._asserts.equal({act:1,exp:'1'}).pass).eql(true)
      // fails
      stree(tree._asserts.equal({act:1,exp:2}).pass).eql(false)
      stree.done(5)
    })
    stree.branch('throws', function(stree) {
      stree.expect(5)
      stree(tree._asserts.throws).type('function')
      stree(tree.throws).type('function')
      stree(tree._asserts.throws({act:function(){}}).pass).eql(false)
      stree(tree._asserts.throws({act:function(){a()}}).pass).eql(true)
      stree(tree._asserts.throws({act:'non-fn'}).pass).eql(true)
      stree.done()
    })
    stree.branch('deepEql', function(stree) {
      stree.expect(22)
      stree(tree._asserts.deepEql).type('function')
      stree(tree.deepEql).type('function')
      var x1 = {
          str:'str'
        , ary:['s','tr']
        , num:[1,Infinity]
        , bool:[true,false]
        , fn:function() {return 222}
        , date:new Date('1992-04-08')
        , nan:NaN
        , falsy:[null,undefined,'',0]
        , deep:{a:1, b:{x:2, f:[4, undefined]}}
      }
      x1.fn._prop = 2
      var x2 = {
          str:'str'
        , ary:['s','tr']
        , num:[1,Infinity]
        , bool:[true,false]
        , fn:function() {return 222}
        , date:new Date('1992-04-08')
        , nan:NaN
        , falsy:[null,undefined,'',0]
        , deep:{a:1, b:{x:2, f:[4, undefined]}}
      }
      x2.fn._prop = 2
      // passes
      for (key in x1) if (x1.hasOwnProperty(key)) {
        stree(tree._asserts.deepEql({act:x1[key],exp:x2[key]}).pass).eql(true)
      }
      stree(tree._asserts.deepEql({act:x1,exp:x2}).pass).eql(true)
      // fails
      for (key in x1) if (x1.hasOwnProperty(key)) {
        stree(tree._asserts.deepEql({act:(x1[key]+'salt')
          , exp:x2[key]}).pass).eql(false)
      }
      x2.fn._method = function() {}
      stree(tree._asserts.deepEql({act:x1,exp:x2}).pass).eql(false)
      stree.done()
    })
    //stree.branch('STREE 1.6.6 instance', function(stree) {})
      //stree.branch('STREE 1.6.8 exists', function(stree) {})
      //stree.branch('STREE 1.6.9 truthy', function(stree) {})
      //stree.branch('STREE 1.6.10 empty', function(stree) {})
      //stree.branch('STREE 1.6.11 above', function(stree) {})
      //stree.branch('STREE 1.6.12 below', function(stree) {})
      //stree.branch('STREE 1.6.13 between', function(stree) {})
    stree.branch('template check', function(stree) {
      for (key in tree._asserts) if (tree._asserts.hasOwnProperty(key)) {
        stree(tree._assertTpl[key]).type('string')
      }
      stree.done(8)
    })
    stree.branch('not', function(stree) {
      tree.branch('closure', function(tree) {
        stree(tree.not).type('object')
        var stash = tree._announcer
        tree._announcer = function(obj) {
          stree(obj.pass).eql(true)
        }
        tree(1).not.eql(2)
        tree(1).not.eql('1')
        tree._announcer = function(obj) {
          console.log(obj)
          stree(obj.pass).eql(false)
        }
        tree(1).not.eql(1)
        tree(1).not.equal('1')
        tree._announcer = stash
        stree.done(5)
        tree.done(4)
      })
    })  
    stree.done(0)
  })

  stree.branch('branches', function(stree) {
    //debugger
    stree.branch('branching', function(stree) {
      stree.timeout(2000)
      stree.expect(8)
      tree.branch('Some name', function(tree) {
        tree.expect(0)
        stree(tree._name).eql('Some name')
        stree(tree._children).type('array')
        stree(tree._children.length).eql(0)
        tree.branch('Some other name', function(tree) {
          tree.expect(0)
          stree(tree._name).eql('Some other name')
          stree(tree._parent._name).eql('Some name')
          tree.branch(function(tree) {
            tree.expect(0)
            stree(tree._name).eql('')
            stree.done()
            tree.done()
          })
          tree.done()
        })
        stree(tree._children.length).eql(1)
        stree(tree._children[0]._name).eql('Some other name')
        tree.done()
      })
      function __done () {
        stree.done()
      }
    })
    stree.branch('run only once', function(stree) {
      var onceCount = 0
      tree.branch('once', function(tree) {
        stree(++onceCount).eql(1)
        stree.done(1)
        tree.done(0)
      })
    })
    stree.branch('parents', function(stree) {
      tree.branch('cont', function(tree) {
        stree(tree._parent).type('function')
        stree(tree._parent._parent).type('undefined')
        stree.done(2)
        tree.done(0)
      })
    })
    stree.branch('expectations', function(stree) {
      stree.expect(13)
      tree.branch('none', function(tree) {
        stree(tree.config('expect')).eql(-1)
        tree.expect('string')
        stree(tree.config('expect')).eql(-1)
        tree.expect(3.34)
        stree(tree.config('expect')).eql(3.34)
        tree.expect(-422)
        stree(tree.config('expect')).eql(-1)
        tree.expect(2)
        stree(tree.config('expect')).eql(2)
        tree.expect(0)
        stree(tree.config('expect')).eql(0)
        tree(1).eql(1)
        stree(tree._done).eql(false)
        tree.done(1)
        stree(tree.config('expect')).eql(1)
        stree(tree._done).eql(true)
        stree.done()  
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
        tree.done()
        tree._announcer = stash
      })
    })
    stree.branch('async handling', function(stree) {
      stree.branch('queue check', function(stree) {
        stree.branch('backwards', function(stree) {
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
        stree.branch('Next picking', function(stree) {
          var pick = tree._next._pick
          stree(pick).type('function')

          var childrenCont = [
            {
              name: 'childrenEmpty'
              , children: [
              ], expect: 'up'
            }, {
              name: 'childrenNoneRun'
              , children: [
                {_run:false, _parallel:null, _done:false, _timedOut:false}
                , {_run:false, _parallel:null, _done:false, _timedOut:false}
              ], expect: 0
            }, {
              name: 'childrenOneRun'
              , children: [
                {_run:true, _parallel:false, _done:true, _timedOut:false}
                , {_run:false, _parallel:null, _done:false, _timedOut:false}
              ], expect: 1
            }, {
              name: 'childrenAllRunNoneDone'
              , children: [
                {_run:true, _parallel:null, _done:false, _timedOut:false}
                , {_run:true, _parallel:null, _done:false, _timedOut:false}
              ], expect: 'wait'
            }, {
              name: 'childrenSerialLast'
              , children: [
                {_run:true, _parallel:false, _done:true, _timedOut:false}
                , {_run:true, _parallel:false, _done:false, _timedOut:true}
                , {_run:true, _parallel:false, _done:true, _timedOut:false}
                , {_run:false, _parallel:null, _done:false, _timedOut:false}
              ], expect: 3
            }, {
              name: 'childrenSerialUp'
              , children: [
                {_run:true, _parallel:false, _done:true, _timedOut:false}
                , {_run:true, _parallel:false, _done:false, _timedOut:true}
                , {_run:true, _parallel:false, _done:true, _timedOut:false}
                , {_run:true, _parallel:false, _done:true, _timedOut:false}
              ], expect: 'up'
            }, {
              name: 'childrenParallel'
              , children: [
                {_run:true, _parallel:true, _done:true, _timedOut:false}
                , {_run:true, _parallel:true, _done:false, _timedOut:true}
                , {_run:false, _parallel:null, _done:false, _timedOut:false}
                , {_run:false, _parallel:null, _done:false, _timedOut:false}
              ], expect: 2
            }, {
              name: 'childrenParallelWaitForEveryone'
              , children: [
                {_run:true, _parallel:true, _done:false, _timedOut:true}
                , {_run:true, _parallel:true, _done:false, _timedOut:false}
                , {_run:true, _parallel:false, _done:false, _timedOut:false}
                , {_run:false, _parallel:null, _done:false, _timedOut:false}
              ], expect: 'wait'
            }, {
              name: 'childrenParallelWaitForEveryone2'
              , children: [
                {_run:true, _parallel:true, _done:false, _timedOut:true}
                , {_run:true, _parallel:true, _done:false, _timedOut:false}
                , {_run:true, _parallel:false, _done:true, _timedOut:false}
                , {_run:false, _parallel:null, _done:false, _timedOut:false}
              ], expect: 'wait'
            }, {
              name: 'childrenParallelNeedlessToWait'
              , children: [
                {_run:true, _parallel:true, _done:false, _timedOut:true}
                , {_run:true, _parallel:true, _done:false, _timedOut:false}
                , {_run:false, _parallel:null, _done:false, _timedOut:false}
              ], expect: 2
            }, {
              name: 'childrenParallelNeedlessToWait_2'
              , children: [
                {_run:true, _parallel:true, _done:false, _timedOut:false}
                , {_run:false, _parallel:true, _done:false, _timedOut:false}
              ], expect: 1
            }, {
              name: 'childrenParallelDontUp'
              , children: [
                {_run:true, _parallel:true, _done:false, _timedOut:true}
                , {_run:true, _parallel:true, _done:false, _timedOut:false}
                , {_run:true, _parallel:true, _done:true, _timedOut:false}
                , {_run:true, _parallel:false, _done:false, _timedOut:false}
              ], expect: 'wait'
            }, {
              name: 'childrenParallelUp'
              , children: [
                {_run:true, _parallel:true, _done:false, _timedOut:true}
                , {_run:true, _parallel:true, _done:false, _timedOut:false}
                , {_run:true, _parallel:true, _done:true, _timedOut:false}
                , {_run:true, _parallel:true, _done:false, _timedOut:false}
              ], expect: 'up' // has been changed from wait to resolve shaw issue
            }
          ]
          // run these tests!
          for (var i = 0; i < childrenCont.length; i++) {
            var c = childrenCont[i]
            // fake complete tree object!
            for (var i2 = 0; i2 < c.children.length; i2++) {
              c.children[i2].cfg = function(str) {
                if (str == 'parallel') {
                  return this._parallel
                }else{
                  return undefined
                }
              }
            }
            console.log('running', c.name)
            stree(pick(c.children)).eql(c.expect)
          }
          stree.done(i+1)
        })
        stree.branch('Li\'l bit of integration', function(stree) {
          stree.expect(4)
          tree.branch('closure', function(tree) {
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
            tree.done(0)
            stree(++count).eql(4)
          })
        })
        stree.branch('branch objects', function(stree) {
          tree.branch('simple', function(tree) {
            tree.branch('1', function(tree) {
              stree(tree._children.length).eql(0)
              stree(tree._run).eql(true)
              stree(tree.cfg('parallel')).eql(null)
              stree(tree._done).eql(false)
              stree(tree._timedOut).eql(false)
              tree.done(0)
              stree(tree._run).eql(true)
              stree(tree.cfg('parallel')).eql(false)
              stree(tree._done).eql(true)
              stree(tree._timedOut).eql(false)
            })
            stree(tree._children[0]._run).eql(false)
            stree(tree._children[0].cfg('parallel')).eql(null)
            stree(tree._children[0]._done).eql(false)
            stree(tree._children[0]._timedOut).eql(false)
            tree.done(0)
            stree(tree._children[0]._run).eql(true)
            stree(tree._children[0].cfg('parallel')).eql(false)
            stree(tree._children[0]._done).eql(true)
            stree(tree._children[0]._timedOut).eql(false)
          })
          tree.branch('Parallel', function(tree) {
            stree(tree.fireNextToo).type('function')
            tree.branch('0', function(tree) {
              stree(tree._parent._children[0]._run).eql(true)
              stree(tree._parent._children[0].cfg('parallel')).eql(null)
              stree(tree._parent._children[0]._done).eql(false)
              stree(tree._parent._children[0]._timedOut).eql(false)
              stree(tree._parent._children[1]._run).eql(false)
              stree(tree._parent._children[1].cfg('parallel')).eql(null)
              stree(tree._parent._children[1]._done).eql(false)
              stree(tree._parent._children[1]._timedOut).eql(false)
              stree(tree._parent._children[2]._run).eql(false)
              stree(tree._parent._children[2].cfg('parallel')).eql(null)
              stree(tree._parent._children[2]._done).eql(false)
              stree(tree._parent._children[2]._timedOut).eql(false)
              tree.fireNextToo()
              stree(tree._parent._children[0]._run).eql(true)
              stree(tree._parent._children[0].cfg('parallel')).eql(true)
              stree(tree._parent._children[0]._done).eql(false)
              stree(tree._parent._children[0]._timedOut).eql(false)
              stree(tree._parent._children[1]._run).eql(true)
              stree(tree._parent._children[1].cfg('parallel')).eql(true)
              stree(tree._parent._children[1]._done).eql(false)
              stree(tree._parent._children[1]._timedOut).eql(false)
              stree(tree._parent._children[2]._run).eql(true)
              stree(tree._parent._children[2].cfg('parallel')).eql(false)
              stree(tree._parent._children[2]._done).eql(true)
              stree(tree._parent._children[2]._timedOut).eql(false)
              tree.done(0)
            })
            tree.branch('1', function(tree) {
              tree.fireNextToo()
              setTimeout(function() {
                tree.done(0)
              },200)
            })
            tree.branch('2', function(tree) {
              tree.done(0)
            })
            stree(tree._children[0]._run).eql(false)
            stree(tree._children[0].cfg('parallel')).eql(null)
            stree(tree._children[0]._done).eql(false)
            stree(tree._children[0]._timedOut).eql(false)
            stree(tree._children[1]._run).eql(false)
            stree(tree._children[1].cfg('parallel')).eql(null)
            stree(tree._children[1]._done).eql(false)
            stree(tree._children[1]._timedOut).eql(false)
            stree(tree._children[2]._run).eql(false)
            stree(tree._children[2].cfg('parallel')).eql(null)
            stree(tree._children[2]._done).eql(false)
            stree(tree._children[2]._timedOut).eql(false)
            tree.done(0)
            stree(tree._children[0]._run).eql(true)
            stree(tree._children[0].cfg('parallel')).eql(true)
            stree(tree._children[0]._done).eql(true)
            stree(tree._children[0]._timedOut).eql(false)
            stree(tree._children[1]._run).eql(true)
            stree(tree._children[1].cfg('parallel')).eql(true)
            stree(tree._children[1]._done).eql(false)
            stree(tree._children[1]._timedOut).eql(false)
            stree(tree._children[2]._run).eql(true)
            stree(tree._children[2].cfg('parallel')).eql(false)
            stree(tree._children[2]._done).eql(true)
            stree(tree._children[2]._timedOut).eql(false)
          })
          stree.done(0)
        })
        stree.done(0)
      })
      stree.branch('varsity order', function(stree) {
        var counter = 0
        var asyncWaitTime = 60
        stree.cfg('timeout',3000)
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
                  stree.done(25)
                  tree.done()
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
      stree.branch('timeout', function(stree) {
        // stree.cfg('timeout', 5000)
        stree.branch('timing out', function(stree) {
          stree.cfg('timeout', 5000)
          tree.branch('closure', function(tree) {
            tree.branch('I time in (0)', function(tree) {
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
            }, 10)
            setTimeout(function() {
              stree(tree._children[0]._run).eql(true)
              stree(tree._children[0]._done).eql(true)
              stree(tree._children[0]._timedOut).eql(false)
            }, 150)
            tree.branch('<OK if times out>', function(tree) {})
            setTimeout(function() {
              stree(tree._children[1]._run).eql(true)
              stree(tree._children[1]._done).eql(false)
              stree(tree._children[1]._timedOut).eql(true)
              stree.done(12)
            }, 1400)
            //stree.done(3)
            tree.done(0)
          })
        })
        stree.branch('STREE variable timeout', function(stree) {
          stree.cfg('timeout',10000)
          stree(tree.timeout).type('function')
          tree.branch('mark one', function(tree) {
            var ms = 100
            tree.branch('I time in', function(tree) {
              tree.timeout(ms)
              stree(tree.config('timeout')).eql(ms)
              setTimeout(function() {
                tree.done(0)
              }, ms/2)
            })
            stree(tree._children[0]._run).eql(false)
            stree(tree._children[0]._done).eql(false)
            stree(tree._children[0]._timedOut).eql(false)
            setTimeout(function() {
              stree(tree._children[0]._run).eql(true)
              stree(tree._children[0]._done).eql(false)
              stree(tree._children[0]._timedOut).eql(false)
            }, ms/2-ms/5)
            setTimeout(function() {
              stree(tree._children[0]._run).eql(true)
              stree(tree._children[0]._done).eql(true)
              stree(tree._children[0]._timedOut).eql(false)
            }, ms/2+ms/5)
            tree.branch('<OK if times out>', function(tree) {
              //console.dir(tree)
              tree.timeout(ms)
            })
            setTimeout(function() {
              stree(tree._children[1]._run).eql(true)
              stree(tree._children[1]._done).eql(false)
              stree(tree._children[1]._timedOut).eql(true)
            }, ms+1000)
            tree.done(0)
          })
          tree.branch('mark two', function(tree) {
            var ms = 2500
            tree.branch('I time in', function(tree) {
              tree.timeout(ms)
              setTimeout(function() {
                tree.done(0)
              }, ms/2)
            })
            stree(tree._children[0]._run).eql(false)
            stree(tree._children[0]._done).eql(false)
            stree(tree._children[0]._timedOut).eql(false)
            setTimeout(function() {
              stree(tree._children[0]._run).eql(true)
              stree(tree._children[0]._done).eql(false)
              stree(tree._children[0]._timedOut).eql(false)
            }, ms/2-ms/4)
            setTimeout(function() {
              stree(tree._children[0]._run).eql(true)
              stree(tree._children[0]._done).eql(true)
              stree(tree._children[0]._timedOut).eql(false)
            }, ms/2+ms/4)
            tree.branch('<OK if times out>', function(tree) {
              //tree.timeout(ms)
            })
            setTimeout(function() {
              stree(tree._children[1]._run).eql(true)
              stree(tree._children[1]._done).eql(false)
              stree(tree._children[1]._timedOut).eql(true)
              console.timeEnd('FullMinden')
              stree.done(26)
            }, ms+100)
            tree.done(0)
          })
        })
        stree.done(0)
      })
      stree.done(0)
    })
    stree.done(0)
  })

  stree.branch('announcers', function(stree) {
    stree.branch('linear console', function(stree) {
      stree.branch('announcer interception', function(stree) {
        var stash = tree._announcer
        var name = 'announce!'
        tree.branch(name, function(tree) {
          tree.expect(3)
          stree(tree._announcer).type('function')
          tree._announcer = function(obj) {
            stree(obj).type('object')
            stree(obj.pass).eql(true)
            stree(obj.msg).eql('1 eql 1')
            stree(obj.name).eql(name)
            //stree(obj.not).falsy()
          }
          tree(1).eql(1)
          tree._announcer = function(obj) {
            stree(obj).type('object')
            stree(obj.pass).eql(false)
            stree(obj.msg).eql("1 eql '1'")
            stree(obj.name).eql(name)
            //stree(obj.not).falsy()
          }
          tree(1).eql('1')
          tree._announcer = function(obj) {
            stree(obj).type('object')
            stree(obj.pass).eql(true)
            stree(obj.msg).eql("1 not eql '1'")
            stree(obj.name).eql(name)
            //stree(obj.not).truthy()
          }
          tree(1).not.eql('1')
          tree._announcer = stash
          tree.done()
        })
        tree._announcer = stash
        stree.done(0)
      })
      stree.done(0)
    })
    stree.branch('DOM', function(stree) {
      stree.branch('css inject', function(stree) {
        //$('link[href$="looks2.css"]').remove()
        var tree2 = tree._virgoTreeInstance()
        var tree3 = tree._virgoTreeInstance()
        stree($('link[href$="looks2.css"]').length).eql(0)
        tree2._initDom('foobar123')
        stree($('link[href$="looks2.css"]').length).eql(1)
        tree3._initDom('foobar321')
        stree($('link[href$="looks2.css"]').length).eql(1)
        $('.tree-top').hide()
        stree.done(3)
      })
      stree.branch('initing', function(stree) {
        stree(tree._initDom).type('function')
        stree($('#tree-top').length).eql(0)
        var tree1 = tree._virgoTreeInstance()
        tree1._initDom()
        var t = 'body > div.tree-top > li.branch > '
        stree($(t+'span.handle.dot').length).eql(1)
        stree($(t+'span.handle.plus').length).eql(1)
        stree($(t+'span.handle.minus').length).eql(1)
        stree($(t+'span.stamp.await').length).eql(1)
        stree($(t+'span.stamp.failed').length).eql(1)
        stree($(t+'span.stamp.passed').length).eql(1)
        stree($(t+'span.stamp.comment').length).eql(1)
        stree($(t+'span.summary').length).eql(1)

        var tree2 = tree._virgoTreeInstance()
        stree($('#foobar').length).eql(0)
        tree2._initDom('foobar')
        stree($('body > div#foobar.tree-top').length).eql(1)
        var t = 'body > div#foobar.tree-top >li>'
        stree($(t+' span.handle').length).eql(3)
        stree($(t+' span.stamp').length).eql(4)
        stree($(t+' span.summary').length).eql(1)

        var tree3 = tree._virgoTreeInstance()
        stree(tree3._global.$treeTop).eql(undefined)
        tree3._initDom('foobar22223')
        stree(tree3._global.$treeTop).eql($('#foobar22223>li.branch').get(0))

        $('.tree-top').hide()
        stree.done(17)
      })
      stree.branch('initing by dom element', function(stree) {
        var $frame = $('<iframe style="width:100%;margin-left:-4px">')
          .appendTo('body').contents().find('html')
        var tree1 = tree._virgoTreeInstance()
        tree1._initDom($frame)
        var t = 'body > div#tree-top.tree-top > li.branch > '
        stree($frame.find(t+' span.handle').length).eql(3)
        stree($frame.find(t+' span.stamp').length).eql(4)
        stree($frame.find(t+' span.summary').length).eql(1)
        stree.done(3)
      })
      // stree.branch('implicit init', function(stree) {
      //   $('body > div.tree-top').remove()
      //   stree($('body > div.tree-top').length).eql(0)
      //   var tree1 = tree._virgoTreeInstance()
      //   stree($('body > div.tree-top').length).eql(0)
      //   tree1('a').eql('b')
      //   stree($('body > div.tree-top').length).eql(1)

      //   $('body > div.tree-top').remove()
      //   stree($('body > div.tree-top').length).eql(0)
      //   var tree2 = tree._virgoTreeInstance()
      //   stree($('body > div.tree-top').length).eql(0)
      //   tree2.branch('a', function() {
      //   })
      //   stree($('body > div.tree-top').length).eql(1)

      //   stree.done(6)
      // })

      //stree.branch('branching', function(stree) {
      //  var tree2 = tree._virgoTreeInstance()

      //  tree2._initDom('asdbar')
      //  var spec = 'body > div.tree-top#asdbar'
      //  stree($('#asdbar li.branch').length).eql(0)
      //  tree2.branch('abc', function(tree2) {
      //    tree2(1).eql(1)
      //    tree2.done(0)
      //  })
      //  stree($(spec+' ul li.branch').length).eql(1)
      //  stree.done(2)
      //})
      stree.branch('branching 101', function(stree) {
        var tree2 = tree._virgoTreeInstance()
        tree2._initDom('asdbar')
        var spec = 'body > div.tree-top#asdbar > li'
        stree(tree2._announcer.registerBranch).type('function')
        console.dir(tree2._domElem)
        stree(tree2._domElem.toString()).eql('[object HTMLLIElement]')
 
        var tree3 = tree._virgoTreeInstance()
        tree3.cfg('name', 'trololololooo')
        tree3._parent = tree2
        stree($('#asdbar li.branch').length).eql(1)
        tree2._announcer.registerBranch(tree3)
        stree($(spec+' ul li.branch').length).eql(1)
        stree($(spec+' ul li.branch > span.handle').length).eql(3)
        stree($(spec+' ul li.branch > span.stamp').length).eql(4)
        stree($(spec+' ul li.branch > span.summary').length).eql(1)
        stree($(spec+' ul li.branch > ul').length).eql(1)
        //var tree4 = tree._virgoTreeInstance()
        //tree4.cfg('name', 'trololololooo 2')
        //tree4._parent = tree3
        //stree($(spec+' ul li.branch li.branch').length).eql(0)
        //tree3._announcer.registerBranch(tree4)
        //stree($(spec+' ul li.branch li.branch').length).eql(1)
        $('.tree-top').hide()
        stree.done(8)
      })
      //stree.branch('branching 202', function(stree) {
      //  var tree2 = tree._virgoTreeInstance()
      //  var randName = 'test8956'
      //  tree2._initDom(randName)
      //  stree($('#'+randName+' li.branch li').length).eql(0)
      //  tree2.branch('name 1', function(tree2) {
      //    stree(t.hasClass('await')).ok()
      //    stree(t.hasClass('collapsed')).not.ok()
      //    stree(t.hasClass('no-children')).ok()
      //    stree(t.hasClass('expanded')).not.ok()
      //    stree(t.hasClass('failed')).not.ok()
      //    stree(t.hasClass('passed')).not.ok()
      //    stree($('#'+randName+' li.branch li.branch li.branch').length).eql(0)
      //    tree2.branch('name 1.1', function(tree2) {
      //      tree2.done(0)
      //      stree(t.hasClass('await')).ok()
      //      stree(t.hasClass('no-children')).not.ok()
      //      stree(t.hasClass('collapsed')).ok()
      //      stree(t.hasClass('expanded')).not.ok()
      //      stree(t.hasClass('failed')).not.ok()
      //      stree(t.hasClass('passed')).not.ok()
      //    })
      //    stree($('#'+randName+' li.branch li.branch').length).eql(3)
      //    tree2.branch('naase 1.2', function(tree2) {
      //      tree2.done(0)
      //      stree(t.hasClass('await')).not.ok()
      //      stree(t.hasClass('collapsed')).ok()
      //      stree(t.hasClass('expanded')).not.ok()
      //      stree(t.hasClass('failed')).not.ok()
      //      stree(t.hasClass('passed')).ok()
      //    })
      //    stree($('#'+randName+' li.branch li.branch li.branch').length).eql(2)
      //    tree2.done(0)
      //    stree(t.hasClass('await')).ok()
      //    stree(t.hasClass('collapsed')).ok()
      //    stree(t.hasClass('expanded')).not.ok()
      //    stree(t.hasClass('failed')).not.ok()
      //    stree(t.hasClass('passed')).not.ok()
      //    stree(t.hasClass('commented')).not.ok()
      //  })
      //  var t = $('#'+randName+' li.branch li.branch')
      //  stree(t.length).eql(1)
      //  stree(t.hasClass('await')).ok()
      //  stree(t.hasClass('no-children')).ok()
      //  stree(t.hasClass('collapsed')).not.ok()
      //  stree(t.hasClass('expanded')).not.ok()
      //  stree(t.hasClass('failed')).not.ok()
      //  stree(t.hasClass('passed')).not.ok()
      //  stree(t.hasClass('commented')).not.ok()
      //  tree2.branch('name 2', function(tree2) {
      //    stree($('#'+randName+' li.branch li.branch').length).eql(4)
      //    tree2.branch('name 2.1', function(tree2) {
      //      tree2.done(0)
      //    })
      //    stree($('#'+randName+' li.branch li.branch').length).eql(5)
      //    tree2.branch('name 2.2', function(tree2) {
      //      tree2.done(0)
      //    })
      //    stree($('#'+randName+' li.branch li.branch').length).eql(6)
      //    tree2.done(0)
      //    stree.done(22)
      //  })
      //  stree($('#'+randName+' li.branch').length).eql(3)
      //  //console.error('t._domElem')
      //  //console.dir(t._domElem)
      //  //stree(t._domElem.toString()).type()
      //  tree2.done(0)
      //})
      stree.branch('imlicit init on branch register', function(stree) {
        var tree2 = tree._virgoTreeInstance()
        $('.tree-top').remove()
        stree($('.tree-top').length).eql(0)
        tree2.branch('asd',function() {})
        stree($('.tree-top').length).eql(1)
        stree($('.tree-top li.branch ul').length).eql(1)
        stree.done(3)
      })

      //stree.branch('imlicit init on assert register', function(stree) {
      //  var tree2 = tree._virgoTreeInstance()
      //  $('.tree-top').remove()
      //  stree($('.tree-top').length).eql(0)
      //  tree2(1).eql(1)
      //  stree($('.tree-top').length).eql(1)
      //  stree($('.tree-top li.assert ul').length).eql(1)
      //  stree.done(3)
      //})
      stree.done(0)
    })
    stree.done(0)
  })
  stree.done(0)
  tree.done(0)
})