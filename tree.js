define(function() {
  function _treeInstance() {
    var tree = function(got) {
      tree._assertCount++
      tree._got = got
      return tree
    }

    tree._expect = -1
    tree._name = ''
    tree._assertCount = 0
    tree._children = []
    tree._done = false

    tree._formateer = function(input) {
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
        } else if (single) {
          output = dbl+input+dbl
        } else {
          output = sgl+input+sgl
        }
      } else if (type == 'function') {
        output = 'fn(){…}'
      } else if (Array.isArray(input)) {
        output = '[…]'
      } else if (type == 'object' && input.toString() === '[object Object]') {
        output = '{…}'
      } else if (type == 'boolean') {
        output = input.toString()
      } else {
        output = '[unknown type: '+input+']'
      }
      return output
    }

    tree._announcer = function(obj) {
      var str = obj.name+': '+obj.msg
      if (obj.pass) {
        console.log(str)
      }else{
        console.error(str)
      }
    }

    tree.type = function(exp) {
      var frm = tree._formateer
      var got = this._got
      var pass
      if (exp === 'array') {
        pass = Array.isArray(got)
      }else{
        pass = typeof got === exp
      }
      got = frm(got)
      exp = frm(exp)

      tree._announcer({
        pass: pass,
        name: tree._name,
        msg: ['typeof', got, (pass?'==':'!='), exp].join(' ')
      })
    }
    tree.eql = function(exp) {
      var frm = tree._formateer
      var got = this._got
      var pass = got === exp
      got = frm(got)
      exp = frm(exp)

      tree._announcer({
        pass: pass,
        name: tree._name,
        msg: [got, (pass?'===':'!=='), exp].join(' ')
      })
    }

    tree.config = function(obj) {
      var defaults = {
        
      }
    }
    tree.branch = function(name, callback) {
      var childTree = new _treeInstance()
      childTree._name = name
      childTree._parent = tree
      tree._children.push(childTree)
      callback(childTree)
    }
    tree.expect = function(count) {
      if (count > 0) {
        this._expect = count
        var self = this
      } else {
        this._expect = -1
        //console.error('Not valid expectation')
      }
    }
    tree.done = function() {
      var got = tree._assertCount
      var exp = tree._expect
      if (tree._done) {
        console.error(tree._name+': done called twice!')
        return
      }
      if (exp === got) {
        console.log(tree._name+' done.')
      }else{
        if (exp === -1) {
          console.error(tree._name+': expectation not set up properly')          
        }else{
          console.error(tree._name+': exp %d assertons, but %d run!', exp, got)
        }
      }
      tree._done = true
    }

    tree._debugInstance = function(opts) {
      return new _treeInstance()
    }
    return tree
  }
  return new _treeInstance()
})

function getCallerLine(moduleName, cCons) {
  // Make an error to get the line number
  var e = new Error()
  //  in case of custum console, the stack trace is one item longer
  var splitNum = 3
  var line = e.stack.split('\n')[splitNum]
  var parts = line.split('/')
  var last_part = parts[parts.length -1]
  var file_name = last_part.substring(0,last_part.length-1)
  if (moduleName)
    return moduleName + ' ('+file_name+')'
  return file_name
}