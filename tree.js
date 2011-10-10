define(function() {
  function _treeInstance() {
    var tree = function(act) {
      tree._assertCount++
      tree._act = act
      return tree
    }

    tree._debugMode = false
    tree._expect = -1
    tree._name = 'trunk'
    tree._assertCount = 0
    tree._children = []
    tree._run = false
    tree._done = false
    tree._timedOut = false
    tree.not = {_not:true}
    tree._asserts = {}
    tree._helpers = {}

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
      if (obj.exp === 'array') {
        obj.pass = Array.isArray(obj.act)
      } else  {
        obj.pass = typeof obj.act === obj.exp
      }
      return obj
    }
    tree._asserts.eql = function(obj) {
      obj.pass = (obj.act === obj.exp)
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

    tree.config = function(obj) {
      var defaults = {
        //////////////////////////////////////////////////////////////////
      }
    }
    // tree.waitForDone = function() {
    //   this._waitForDone = true
    // }
    // tree.fireNextToo = function() {
    //   this._waitForDone = false
    // }
    tree.branch = function(name, newBranchCode) {
      if (typeof name == 'function') newBranchCode = name
      if (typeof name != 'string') name = ''
      if (tree._done) return console.error(name+' after .done()!')
      var currentTree = tree
      var newBranchTree = new _treeInstance()
      newBranchTree._code = newBranchCode   
      newBranchTree._name = name
      newBranchTree._parent = currentTree
      newBranchTree._debugMode = currentTree._debugMode
      currentTree._children.push(newBranchTree)
      //newBranchCode(newBranchTree)
      // if (!newBranchTree._done) {
      //   newBranchTree._timerId = setTimeout(function() {
      //     console.error(name, 'timed out!')
      //   }, 1000)
      // }
    }
    tree._next = function() {
      var found = false
      var c
      for (var i = 0; i < tree._children.length; i++) {
        c = tree._children[i]
        if (!c._run /*&& !c._timedOut*/) {
          found = true
          break
        }
      }
      if (found) {
        ;(function(c) {
          setTimeout(function() {
            console.log('TIMEOUT BACK')
            if (!c._done) {
              c._timedOut = true
              console.warn(c._name+' timed out. Carrying on.')
              tree._next()
            }
          },1000)
        })(c)
        c._run = true
        c._code(c)
      } else {
        if (tree._parent) {
          tree._parent._next()
        } else {    
          // fullyDone event
          console.warn('no more parents')
        }
      }
    }
    tree._helpers._display = function(fn) {
      var obj = {}
      for (key in fn) if (fn.hasOwnProperty(key)) {
        obj[key] = fn[key]
      }
      return obj
    }
    tree.expect = function(count) {
      if (count >= 0) {
        this._expect = count
        var self = this
      } else {
        this._expect = -1
      }
    }
    tree.done = function() {
      var run = tree._assertCount
      var exp = tree._expect
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
      tree._done = true
      tree._next()
    }
    //tree._debugInstance = function(opts) {
    //  console.warn('tree._debugInstance is depracated')
    //  var stree = new _treeInstance()
    //  stree._debugMode = true
    //  return stree
    //}
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
  return new _treeInstance()
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