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

    tree.type = function(expected) {
      var passed
      if (expected === 'array') {
        passed = Array.isArray(this._got)
      }else{
        passed = typeof this._got === expected
      }

      if (typeof this._got === 'function') {
        this._got = 'fn(){…}'
      } else if (Array.isArray(this._got)) {
        this._got = '[…]'
      }

      if (passed) {
        console.log(tree._name+': typeof '+this._got+' === '+expected)
      }else{
        console.error(
          tree._name+': typeof '+this._got+' !== '+expected+" ("+getCallerLine()+")"
        )
      }
    }
    tree.eql = function(expected) {
      var passed = this._got === expected
      if (passed) {
        console.log(tree._name+': '+this._got+' === '+expected)
      }else{
        console.error(
          tree._name+': '+this._got+' !== '+expected+" ("+getCallerLine()+")"
        )
      }
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
          console.error(tree._name+': expected %d assertons, but %d run!', exp, got)
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