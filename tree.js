define(function() {
  var TREE_START = Date.now()
  function _treeInstance() {

    // Hart of the framework
    var tree = function(act) {
      tree._assertCount++
      tree._act = act
      return tree
    }

    // Host objects
    tree.not = {_not:true}
    tree._asserts = {}
    tree._helpers = {}

    tree.config = tree.cfg = function (obj, val) {
      // might be needed later
      var defaults = {}
      // if it is called on the .heritable. path, this._heritable is true
      // otherwise false or undefined
      var heritable = this._heritable
      // spec(ific) is false if called simply by tree.config, true if taking other path
      var spec = this._spec
      // taming the input
      var obj = tree.cfg._morph(obj, val)
      if (obj == null || typeof obj == 'string') {
        return read(obj)
      } else if (typeof obj == 'object') {
        return write(obj)
      }
      function write (obj) {
        if (heritable) {
          for (key in obj) if (obj.hasOwnProperty(key)) {
            tree.config.heritable[key] = obj[key]
          }
        } else {    
          for (key in obj) if (obj.hasOwnProperty(key)) {
            tree.config.oneLevel[key] = obj[key]
          }
        }
        return read()
      }
      function read (str) {
        if (!spec) {
          return getMixed(str)
        } else {
          if (str) {
            return getProper()[str]
          } else {
            return getProper()
          }
        }
        function getProper () {
          if (heritable) {
            return tree.config.heritable
          } else {
            return tree.config.oneLevel
          }
        }
        // combine HER and ONE, in case of conflict the latter wins
        function getMixed (str) {
          var her = tree.config.heritable
          var one = tree.config.oneLevel
          if (str) { // single query
            return (typeof one[str] !== 'undefined' ?
                one[str]
              : her[str])
          } else { // general query
            var out = {}
            for (key in her) if (her.hasOwnProperty(key)) {
              out[key] = her[key]
            }
            for (key in one) if (one.hasOwnProperty(key)) {
              out[key] = one[key]
            }
            return out
          }
        }
      }
    }
    // tame the input
    tree.config._morph = function(obj, val) {
      if (typeof obj == 'object' && obj) {
        // we do not care about val, obj alone does it
        return obj
      } else if (typeof obj == 'string') {
        // we can either have a read request
        if (typeof val == 'undefined') {
          // all exact read calls are in string form 
          return obj
        } else { // or a write request
          // all write calls are in object form
          var o = {}
          o[obj] = val
          return o
        }
      } else {
        // general read is null
        return null
      }
    }
    tree.config.oneLevel = {}
    tree.config.heritable = {}
    tree.oneLevel = {
      _heritable: false
      , _spec: true
      , config: tree.cfg
      , cfg: tree.cfg
    }
    tree.heritable = {
      _heritable: true
      , _spec: true
      , cfg: tree.cfg
      , config: tree.cfg
    }

    tree._helpers._templater = function(tplstr, vars) {
      if (typeof vars != 'object') var vars = {}
      if (typeof tplstr != 'string')
        throw new Error('Template string is not a string!')
      var RE_ifTruthy = /{{\s*#\s*(.*?)\s*}}(.*?){{\s*\/\s*\1\s*}}/g
      var RE_ifFalsy = /{{\s*\^\s*(.*?)\s*}}(.*?){{\s*\/\s*\1\s*}}/g
      while (tplstr.match(RE_ifTruthy)) {
        tplstr = tplstr.replace(RE_ifTruthy
        , function(full, varName, content, pos, oStr) {
          if (vars[varName]) {
            return content
          }else{
            return ''
          }
        })
      }
      while (tplstr.match(RE_ifFalsy)) {
        tplstr = tplstr.replace(RE_ifFalsy
        , function(full, varName, content, pos, oStr) {
          if (vars[varName]) {
            return ''
          }else{
            return content
          }
        })
      }
      return tplstr.replace(/{{\s*([^}]*?)\s*}}/g
      , function(match, group, pos, oStr) {
        if (group in vars) {
          return vars[group]
        }else{
          return '' 
        }
      })
    }
    tree._helpers._formateer = function(input) {
      var output = ''
      var type = typeof input
      if (type == 'number') {
        output = input.toString()
      } else if (type == 'string') {
        var single = input.match(/'/g)
        var double = input.match(/"/g)
        var sgl = "'"
        var dbl = '"'
        var esc = '\\'
        if (single && double) {
          if (double.length < single.length) { // more single than doulbe
            output = dbl+input.replace(/"/g, esc+dbl)+dbl
          } else { // more or equal count of doulbe than count of single
            output = sgl+input.replace(/'/g, esc+sgl)+sgl
          }
        } else if (single) { // if there are singles inside
          output = dbl+input+dbl
        } else { // wheter there are doubles or not
          output = sgl+input+sgl
        }
      } else if (type == 'function') {
        output = 'fn(){…}'
      } else if (Array.isArray(input)) {
        output = '[…]'
      } else if (type == 'object' &&
                input &&
                input.toString() === '[object Object]') {
        output = '{…}'
      } else if (type == 'boolean') {
        output = input.toString()
      } else if (type == 'undefined') {
        output = 'undefined'
      } else if (input == null) {
        output = 'null'
      } else {
        output = '[unknown type: '+input+']'
      }
      return output
    }
    tree._announcer = function(obj) {
      var str = obj.name+': '+obj.msg
      if (obj.pass) {
        console.log(str)
      } else {
        console.error(str+' ('+getCallerLine()+')')
      }
    }
    //tree.note = function(str) {
    //  this._note = str
    //}
    tree._assertTpl = {
      ok: '{{actS}} {{#not}}not {{/not}}ok'
      , pass: 'pass'
      , fail: 'fail'
      , truthy: '{{actS}} {{#not}}not {{/not}}truthy'
      , falsy: '{{actS}} {{#not}}not {{/not}}falsy'
      , eql: '{{actS}} {{#not}}not {{/not}}eql {{expS}}'
      , equal: '{{actS}} {{#not}}not {{/not}}equal {{expS}}'
      , deepEql: '{{actS}} {{#not}}not {{/not}}deepEql {{expS}}'
      , type: '{{actS}} {{#not}}not {{/not}}type {{expS}}'
      , throws: '{{actS}} {{#not}}not {{/not}}throws'
    }
    tree._asserts.ok = function(obj) {
      obj.pass = !!obj.act
      return obj
    }
    tree._asserts.pass = function(obj) {
      obj.pass = true
      return obj
    }
    tree._asserts.throws = function(obj) {
      obj.pass = null
      try {
        obj.act()
      } catch (e) {
        obj.pass = true
      }
      obj.pass = obj.pass? obj.pass : false
      return obj
    }
    tree._asserts.fail = function(obj) {
      obj.pass = false
      return obj
    }
    tree._asserts.type = function(obj) {
      switch (obj.exp.toLowerCase()) {
        case 'array':
          obj.pass = Array.isArray(obj.act)
          break
        case 'nan':
          obj.pass = !(obj.act === obj.act)
          break
        default:
          obj.pass = typeof obj.act === obj.exp
          break
      }
      return obj
    }
    tree._asserts.eql = function(obj) {
      if (obj.exp === obj.exp) {
        obj.pass = (obj.act === obj.exp)
      } else {
        // NaN
        obj.pass = obj.act !== obj.act
      }
      return obj
    }
    tree._asserts.equal = function(obj) {
      obj.pass = (obj.act == obj.exp)
      return obj
    }
    tree._asserts.deepEql = function(obj) {
      obj.pass = tree._helpers.deepEql(obj.exp, obj.act)
      return obj
    }
    tree._helpers.deepEql = function (x1, x2) {
      var t1 = typeof x1
      var t2 = typeof x2
      if (t1 !== t2) {
        return false
      } else if (
        t1 == 'string' ||
        (t1 == 'number' && !isNaN(x1)) ||
        t1 == 'boolean' ||
        t1 == 'undefined' ||
        x1 === null
      ) {
        if (x1 === x2) {
          return true
        }else{
          return false
        }
      } else if (isNaN(x1) && x1 !== x1) {
        if (isNaN(x2) && x2 !== x2) {
          return true
        }else{
          return false
        }
      } else if (Array.isArray(x1) && Array.isArray(x2)) {
        if (x1.length === x2.length) {
          for (var i = 0; i < x1.length; i++) {
            if (!tree._helpers.deepEql(x1[i], x2[i])) {
              // one turns out to be not equal
              return false
            }
          }
          // Every bit was deepEqual
          return true
        }else{
          // Not the same length, no chance for being deepEql
          return false
        }
      } else if (t1 == 'object') {
        if (x1 instanceof Date) {
          if (x2 instanceof Date) {
            return x1.getTime() === x2.getTime()
          } else {
            return false
          }
        } else {
          if (Object.keys(x1).length === Object.keys(x2).length) {
            for (key in x1) if (x1.hasOwnProperty(key)) {
              if (!tree._helpers.deepEql(x1[key], x2[key])) {
                // one turns out to be not equal
                return false
              }
            }
            return true
          } else {
            // Not the same length, no chance for being deepEql
            return false
          }
        }
      } else if (t1 == 'function') {
        if (x1.toString() === x2.toString()) {
          if (Object.keys(x1).length === Object.keys(x2).length) {
            for (key in x1) if (x1.hasOwnProperty(key)) {
              if (!tree._helpers.deepEql(x1[key], x2[key])) {
                // one turns out to be not equal
                return false
              }
            }
            return true
          }else{
            // Not the same length, no chance for being deepEql
            return false
          }
        }else{
          return false
        }
      } else {
        console.error('shouldn\'t get here')
        return false
      }
    }

    tree.sync = {_sync:true}
    tree.branch = function(name, newBranchCode) {
      if (typeof name == 'function') newBranchCode = name
      if (typeof name != 'string') name = ''
      if (tree._done) {
        return console.error('"'+name+'" wanted to get registered after'
          +' it\'s would be parent: "'+tree._name+'"\'s .done()!')
      }
      var currentTree = tree
      var newBranchTree = new _treeInstance()
      newBranchTree._doneCounter = tree._doneCounter
      tree._doneCounter.branchCount++
      newBranchTree._code = newBranchCode   
      newBranchTree._name = name // deprecated line
      newBranchTree._parent = currentTree
      newBranchTree._debugMode = currentTree._debugMode
      newBranchTree.heritable.config(currentTree.heritable.config())
      newBranchTree.oneLevel.config({
        name:name
      })
      if (this._sync) {
        newBranchTree.oneLevel.cfg('sync',true)
        newBranchCode(newBranchTree)
        if (!newBranchTree._done) {
          newBranchTree._timedOut = true
          console.error(newBranchTree._name+' didn\'t call done(). Carrying on.')
          tree._next()
        }
        //if (newBranchTree) {}
      } else {
        currentTree._children.push(newBranchTree)
      }
      //newBranchCode(newBranchTree)
      // if (!newBranchTree._done) {
      //   newBranchTree._timerId = setTimeout(function() {
      //     console.error(name, 'timed out!')
      //   }, 1000)
      // }
      return newBranchTree
    }
    tree.sync.branch = tree.branch
    tree._next = function() {
      var whatDo = tree._next._pick(tree._children)

      if (typeof whatDo == 'number') {
        var c = tree._children[whatDo]
        c._run = true
        c._code(c)
        // debugger
        if (!c._done) {
          setTimeout(function() {
            //console.log('TIMEOUT BACK')
            if (!c._done) {
              c._timedOut = true
              console.warn(c._name+' timed out. Carrying on.')
              tree._next()
            }
          }, c.config('timeout'))
        } /*else {
          c._timedOut = false
        }*/
        if (c.cfg('parallel') && !c._done && !c._timedOut) {
          tree._next()
        }
      } else {
        if (whatDo == 'wait') {
          // Do nothimng literally
        } else if (whatDo == 'up') {
          tree._upped = true
          // Traverse til top
          if (tree._parent) {
            tree._parent._next()
          }
        }
      }
    }
    tree._next._pick = function(cn) {
      var up = 'up'
      var wait = 'wait'

      var run = '_run'
      var parallel = '_parallel'
      var done = '_done'
      var timedOut = '_timedOut'

      var running
      var prevParal = false
      if (cn.length == 0) {
        return up
      }

      for (var i = 0; i < cn.length; i++) {
        var c = cn[i]
        if (!c[done] && !c[timedOut]) {
          if (c[run]) {
            running = true
            if (c.cfg('parallel')) {
              // Do nothing here...
            } else {
              return wait
            }
          } else {
            if (prevParal) {
              return i
            } else {
              //return i
              // WTF Should we check for running??!!??!
              if (running) {
                return wait
              } else {
                return i
              }
            }
          }
        } else {
          // do what? I guess nothing...
        }
        prevParal = c.cfg('parallel')
      }
      return up
      /*if (running) {
        return wait
      } else {
        return up
      }*/
    }
    tree._helpers._display = function(c) {
      c = c || tree
      while (c._parent) {
        c = c._parent
      }
      ;(function disp (stree) {
        if (Array.isArray(stree)) {
          var arr = []
          for (var i = 0; i < stree.length; i++) {
            arr[i] = disp(stree[i])
          }
          return arr
        } else {
          var obj = {}
          if (stree._children.length) {
            console.group(stree._name)
            obj[stree._name] = disp(stree._children)
            console.groupEnd()
          } else {    
            console.log(stree._name)        
          }
          return obj
        }
      })(c)
    }
    tree.expect = function(count) {
      tree.cfg('expect', count >= 0 ? count : -1)
    }
    tree.timeout = function(ms) {
      tree.cfg('timeout', ms)
    }
    tree.fireNextToo = function(a) {
      if (tree._parent) {
        tree.cfg('parallel', a === undefined? true : !!a)
        tree._parent._next()
      } else {
        console.warn('.fireNextToo() is invalid at top level!')
      }
    }
    tree.done = function(n) {
      if (typeof n == 'number') {
        tree.cfg('expect',n)
      }
      var run = tree._assertCount
      var exp = tree.cfg('expect')
      clearTimeout(tree._timerId)
      if (tree._done) {
        tree._announcer({
          pass: false,
          name: tree._name,
          msg: 'done called twice!'
        })
        return
      }
      if (exp === run) {
        tree._announcer({
          pass: true,
          name: tree._name,
          msg: 'done.'
        })
      } else {
        tree._announcer({
          pass: false,
          name: tree._name,
          msg: exp === -1?
              'expect() not called properly! '+run+' assertion(s) run.'
            : 'expected '+exp+' asserton(s), but '+run+' run.'
        })
      }
      if (!tree.cfg('parallel')) {
        tree.cfg('parallel',false)
      }
      tree._done = true
      if (tree._timedOut) {
        // sth, I guess nothing
      } else {
        tree._next()
        tree._doneCounter.doneCount++
        //console.warn(tree._doneCounter.doneCount, tree._doneCounter.branchCount)
        if (tree._doneCounter.doneCount == tree._doneCounter.branchCount) {
          console.warn('Everything fully done! (took '+(Date.now()-TREE_START)+'ms)')
        }
      }
    }

    // Inheritable config
    tree.heritable.cfg({
      name:'No Name Specified',
      expect:-1,
      parallel:null,
      timeout:1000
    })
    // Only for top level
    tree.oneLevel.cfg({
      name:'trunk',
    })
    // Other non-configurable properties
    tree._assertCount = 0
    tree._children = []
    tree._run = false
    tree._done = false
    tree._timedOut = false

    for (key in tree._asserts) if (tree._asserts.hasOwnProperty(key)) {
      if (!tree._assertTpl[key])
        throw new Error('Missing template string for assert: '+key)
      ;(function(key) {
        tree[key] = tree.not[key] = function(exp) {
          var obj = {
            name: tree._name
            , exp: exp
            , act: tree._act
            , expS: tree._helpers._formateer(exp)
            , actS: tree._helpers._formateer(tree._act)
          }
          obj = tree._asserts[key](obj)
          if (this._not === true) {
            obj.pass = !obj.pass
            obj.not = true
          } else {
            obj.not = false
          }
          obj.msg = tree._helpers._templater(tree._assertTpl[key], obj)
          tree._announcer(obj)
          return obj
        }
      })(key)
    }

    return tree
  }
  document.title = "Tree.js"
  var initialTree = new _treeInstance()
  initialTree._doneCounter = {doneCount:0, branchCount:1}
  return initialTree
})

function getCallerLine(moduleName, cCons) {
  // Make an error to get the line number
  var e = new Error()
  //  in case of custum console, the stack trace is one item longer
  var splitNum = 4
  var line = e.stack.split('\n')[splitNum]
  var parts = line.split('/')
  var last_part = parts[parts.length -1]
  var file_name = last_part.substring(0,last_part.length-1)
  if (moduleName)
    return moduleName + ' ('+file_name+')'
  return file_name
}