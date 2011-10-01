require([
  '../tree' // In development, latest version
  , 'stree' // More stable one, proven to be working
], function(tree, stree) {
  // Super Tree instance for testing the test framework.
  //stree = tree._debugInstance()
  stree._debugMode = true
  stree(tree._debugMode).eql(false)
  stree(stree._debugMode).eql(true)
  stree.branch('STREE 1 Top level', function(stree) {
    stree.expect(7)
    stree(tree._debugMode).eql(false)
    stree(stree._debugMode).eql(true)
    stree.branch('STREE 1.1 debug', function(stree) {
      stree(tree._debugMode).eql(false)
      stree(stree._debugMode).eql(true)
    })
    stree.branch('STREE templating', function(stree) {
      var tpl = tree._templater
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
    })
    
    //tree._init()
    stree(tree).type('function')
    stree(tree.config).type('function')
    stree(tree.branch).type('function')
    stree(tree.expect).type('function')
    stree(tree.done).type('function')
    // stree(tree.note).type('function')

    stree.branch('STREE 1.6 testing asserts', function(stree) {
      stree.expect(0)

      var stash = tree._announcer
      stree.branch('STREE 1.6.1 ok', function(stree) {
        stree.expect(16)
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
        stree.done()
      })
      stree.branch('STREE 1.6.2 type', function(stree) {
        stree.expect(8)
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
        stree.done()
      })
      stree.branch('STREE 1.6.2 eql', function(stree) {
        stree.expect(5)
        stree(tree._asserts.eql).type('function')
        stree(tree.eql).type('function')
        // passes
        stree(tree._asserts.eql({act:1,exp:1}).pass).eql(true)
        // fails
        stree(tree._asserts.eql({act:1,exp:'1'}).pass).eql(false)
        stree(tree._asserts.eql({act:1,exp:2}).pass).eql(false)
        stree.done()
      })
      stree.branch('STREE 1.6.3 equal', function(stree) {
        stree.expect(5)
        stree(tree._asserts.equal).type('function')
        stree(tree.equal).type('function')
        // passes
        stree(tree._asserts.equal({act:1,exp:1}).pass).eql(true)
        stree(tree._asserts.equal({act:1,exp:'1'}).pass).eql(true)
        // fails
        stree(tree._asserts.equal({act:1,exp:2}).pass).eql(false)
        stree.done()
      })
      stree.branch('STREE 1.6.4 deepEql', function(stree) {
        window.tree = tree
        stree.expect(7)
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
          stree(tree._asserts.deepEql({act:(x1[key]+'salt'),exp:x2[key]}).pass).eql(false)
        }
        x2.fn._method = function() {}
        stree(tree._asserts.deepEql({act:x1,exp:x2}).pass).eql(false)
      })
      //stree.branch('STREE 1.6.5 deepEqual', function(stree) {})
      stree.branch('STREE 1.6.6 instance', function(stree) {})
      stree.branch('STREE 1.6.7 throws', function(stree) {})
      stree.branch('STREE 1.6.8 exists', function(stree) {})
      stree.branch('STREE 1.6.9 truthy', function(stree) {})
      stree.branch('STREE 1.6.10 empty', function(stree) {})
      stree.branch('STREE 1.6.11 above', function(stree) {})
      stree.branch('STREE 1.6.12 below', function(stree) {})
      stree.branch('STREE 1.6.13 between', function(stree) {})
      tree._announcer = stash
      stree.done()
    })

    stree.branch('STREE 1.2 branching', function(stree) {
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

    stree.branch('STREE 1.3 formateer', function(stree) {
      stree.expect(20)
      tree.branch('formateer!', function(tree) {
        stree(tree._formateer).type('function')
        var frm = tree._formateer
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
      })
      stree.done()
    })

    stree.branch('STREE 1.4 announcer-interception', function(stree) {
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

    stree.branch('STREE 1.5 expectations', function(stree) {
      stree.expect(13)
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
        tree.expect(0)
        stree(tree._expect).eql(0)
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
        tree.done()
        tree._announcer = stash
      })
      stree.done()
    })
    stree.branch('STREE 1.7 async handling', function(stree) {
      stree.branch('STREE 1.7.1 assert count', function(stree) {
        var stash = tree._announcer
        tree.branch('async1', function(tree) {
          tree.expect(1)
          setTimeout(function() {
            tree('test 5191').eql('test 5191')
            tree._announcer = function(obj) {
              stree(obj.msg).eql('done.')
            }
            tree.done()
          }, 100)
        })
        tree.branch('async2', function(tree) {
          tree.expect(1)
          setTimeout(function() {
            tree('test 3219').eql('test 3219')
          }, 100)
          tree._announcer = function(obj) {
            stree(obj.msg).eql('expexted 1 assertons, but 0 run.')
            tree._announcer = stash
          }
          tree.done()
          tree._announcer = new Function()
        })
        // stree.branch('STREE 1.7.2 waitForDone', function(stree) {
        //   stree.branch('STREE 1.7.2.1 queue array', function(stree) {
        //     tree.branch(function(tree) {
        //       tree.waitForDone()
        //       tree.branch(function(tree) {})
        //       tree.branch(function(tree) {})
        //       tree.branch(function(tree) {})
        //       stree(tree._children.length).eql(3)
        //       for (var i = 0; i < tree._children.length; i++) {
        //         if (i == 0) {
        //           stree(tree._children._done).eql()
        //           stree(tree._children._done).eql()
        //         }else{
        //           stree(tree._children.length).eql(3)
        //         }
        //       }
        //     })
        //   })
        //   var count = 0
        //   stree(tree.waitForDone).type('function')
        //   tree.waitForDone()
        //   tree.branch('wait', function(tree) {
        //     tree.expect(0)
        //     setTimeout(function() {
        //       stree(++count).eql(1)
        //       tree.done()
        //     }, 100)
        //   })
        //   tree.branch('wait2', function(tree) {
        //     tree.expect(0)
        //     stree(++count).eql(2)
        //     tree.done()
        //   })
        // })
        // stree.branch('STREE 1.7.3 fireNextToo', function(stree) {
        //   var count = 0
        //   stree(tree.fireNextToo).type('function')
        //   tree.fireNextToo()
        //   tree.branch('fire', function(tree) {
        //     tree.expect(0)
        //     setTimeout(function() {
        //       stree(++count).eql(2)
        //       tree.done()
        //     }, 100)
        //   })
        //   tree.branch('fire2', function(tree) {
        //     tree.expect(0)
        //     stree(++count).eql(1)
        //     tree.done()
        //   })
        // })
      })

    })
    // stree.branch('STREE not', function(stree) {
    //   
    //   stree(tree._asserts).type('object')
    //   stree(tree.not).type('object')
    //   tree._announcer = function(obj) {
    //     stree(obj.pass).eql(true)
    //   }
    //   tree(1).not.eql(2)
    //   tree(1).not.equal('1')
    //   tree._announcer = function(obj) {
    //     stree(obj.pass).eql(false)
    //   }
    //   tree(1).not.eql(1)
    //   tree(1).not.equal('1')
    //   ////////////////////////////////////////////////
    // })
    stree.branch('STREE console announcer', function(stree) {})
    // Later
    stree.branch('STREE graphical announcer', function(stree) {})
    stree.branch('STREE dynamic test loading', function(stree) {})
    stree.branch('STREE suport all 3 loading schemes', function(stree) {})
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