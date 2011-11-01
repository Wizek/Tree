require([
  '../tree' // In development, latest version
  , 'stree' // More stable one, proven to be working
  , '../lib/jquery/dist/jquery.min'
], function(tree, stree, $) {
  console.time('FullMinden')
  window.stree = stree
  stree.expect(0)
  tree.expect(0)
  stree.branch('STREE 1 Top level', function(stree) {
    stree.expect(5)
    stree.branch('STREE templating', function(stree) {
      stree.expect(26)
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
      stree.done()
    })
    
    //tree._init()
    stree(tree).type('function')
    stree(tree.config).type('function')
    stree(tree.branch).type('function')
    stree(tree.expect).type('function')
    stree(tree.done).type('function')
    // stree(tree.note).type('function')

    stree.branch('STREE 1.6 testing asserts', function(stree) {
      stree.expect(1)

      stree(tree._asserts).type('object')
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
        stree.expect(10)
        stree(tree._asserts.type).type('function')
        stree(tree.type).type('function')
        // passes
        stree(tree._asserts.type({act:'1',exp:'string'}).pass).eql(true)
        stree(tree._asserts.type({act:null,exp:'object'}).pass).eql(true)
        stree(tree._asserts.type({act:[],exp:'array'}).pass).eql(true)
        stree(tree._asserts.type({act:[],exp:'object'}).pass).eql(true)
        stree(tree._asserts.type({act:NaN,exp:'NaN'}).pass).eql(true)
        stree(tree._asserts.type({act:NaN,exp:'number'}).pass).eql(true)
        // fails
        stree(tree._asserts.type({act:1,exp:'string'}).pass).eql(false)
        stree(tree._asserts.type({act:{},exp:'array'}).pass).eql(false)
        stree.done(10)
      })
      stree.branch('STREE 1.6.2 eql', function(stree) {
        stree.expect(8)
        stree(tree._asserts.eql).type('function')
        stree(tree.eql).type('function')
        // passes
        stree(tree._asserts.eql({act:1,exp:1}).pass).eql(true)
        stree(tree._asserts.eql({act:NaN,exp:NaN}).pass).eql(true)
        // fails
        stree(tree._asserts.eql({act:1,exp:'1'}).pass).eql(false)
        stree(tree._asserts.eql({act:1,exp:2}).pass).eql(false)
        stree(tree._asserts.eql({act:NaN,exp:'NaN'}).pass).eql(false)
        stree(tree._asserts.eql({act:'NaN',exp:NaN}).pass).eql(false)
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
      stree.branch('STREE throws', function(stree) {
        stree.expect(5)
        stree(tree._asserts.throws).type('function')
        stree(tree.throws).type('function')
        stree(tree._asserts.throws({act:function(){}}).pass).eql(false)
        stree(tree._asserts.throws({act:function(){a()}}).pass).eql(true)
        stree(tree._asserts.throws({act:'non-fn'}).pass).eql(true)
        stree.done()
      })
      stree.branch('STREE 1.6.4 deepEql', function(stree) {
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
          stree(tree._asserts.deepEql({act:(x1[key]+'salt'),exp:x2[key]}).pass).eql(false)
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
      stree.branch('STREE template check', function(stree) {
        stree.expect(8)
        for (key in tree._asserts) if (tree._asserts.hasOwnProperty(key)) {
          stree(tree._assertTpl[key]).type('string')
        }
        stree.done()
      })
      stree.done()
    })

    stree.branch('STREE 1.2 branching', function(stree) {
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
            __done()
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
    stree.branch('STREE branches', function(stree) {
      stree.expect(0)
      stree.branch('STREE run only once', function(stree) {
        stree.expect(0)
        var onceCount = 0
        stree.expect(1)
        tree.branch('once', function(tree) {
          tree.expect(0)
          stree(++onceCount).eql(1)
          stree.done()
          tree.done()
        })
      })
      stree.branch('STREE parents', function(stree) {
        stree.expect(2)
        tree.branch('async', function(tree) {
          //console.log(tree._helpers.display(tree))
          tree.expect(0)
          stree(tree._parent).type('function')
          stree(tree._parent._parent).type('undefined')
          stree.done()
          tree.done()
        })
      })
      stree.branch('STREE async handling', function(stree) {
        stree.expect(0)
        stree.branch('STREE queue check', function(stree) {
          stree('STREE backwards', function(stree) {
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
          stree.branch('STREE branch objects', function(stree) {
            tree.branch('container', function(tree) {
              tree.branch('1', function(tree) {
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
          })
        })
        stree.branch('STREE varsity order', function(stree) {
          stree.expect(25)
          var counter = 0
          var asyncWaitTime = 60
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
                    stree.done()
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
        stree.branch('STREE timeout', function(stree) {
          stree.expect(12)
          tree.branch('timing out', function(tree) {
            tree.branch('I time in', function(tree) {
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
            }, 50)
            setTimeout(function() {
              stree(tree._children[0]._run).eql(true)
              stree(tree._children[0]._done).eql(true)
              stree(tree._children[0]._timedOut).eql(false)
            }, 150)
            tree.branch('I time out', function(tree) {})
            setTimeout(function() {
              stree(tree._children[1]._run).eql(true)
              stree(tree._children[1]._done).eql(false)
              stree(tree._children[1]._timedOut).eql(true)
              stree.done()
            }, 1200)
            tree.done(0)
          })
          stree.branch('STREE variable timeout', function(stree) {
            stree.expect(26)
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
              tree.branch('I time out', function(tree) {
                //console.dir(tree)
                tree.timeout(ms)
              })
              setTimeout(function() {
                stree(tree._children[1]._run).eql(true)
                stree(tree._children[1]._done).eql(false)
                stree(tree._children[1]._timedOut).eql(true)
              }, ms+100)
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
              tree.branch('I time out', function(tree) {
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
        })
        stree.done()
      })
      stree.done()
    })
    stree.branch('STREE 1.3 formateer', function(stree) {
      stree.expect(20)
      tree.branch('formateer!', function(tree) {
        tree.expect(0)
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
        stree.done()
        tree.done()
      })
    })

    stree.branch('STREE 1.4 announcer-interception', function(stree) {
      stree.expect(0)
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
      stree.done()
    })

    stree.branch('STREE 1.5 expectations', function(stree) {
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
    
    stree.branch('STREE not', function(stree) {
      stree.expect(5)
      stree(tree.not).type('object')
      tree._announcer = function(obj) {
        stree(obj.pass).eql(true)
      }
      tree(1).not.eql(2)
      tree(1).not.eql('1')
      tree._announcer = function(obj) {
        stree(obj.pass).eql(false)
      }
      tree(1).not.eql(1)
      tree(1).not.equal('1')
      ////////////////////////////////////////////////
      stree.done()
    })
    stree.branch('STREE console announcer', function(stree) {})
    // Later
    // stree.branch('STREE graphical announcer', function(stree) {})
    // stree.branch('STREE dynamic test loading', function(stree) {})
    // stree.branch('STREE suport all 3 loading schemes', function(stree) {})
    stree.done()
  })
  // stree.branch('announcer', function(stree) {
  //   stree.expect(0)
  //   stree.branch('DOM', function(stree) {
  //     stree.expect(0)
  //     
  //     stree.done()
  //   })
  //   stree.done()
  // })
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
        stree(tree.config('z')).type('NaN')
        
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
      console.log(tree.config())
      stree(tree.config()).deepEql({
        name:'trunk'
        , expect:0
        , parallel:null
        , timeout:1000
      })
      stree.done()
    })
    // default trunk
    stree.done()
  })
  stree.done()
  tree.done()
})