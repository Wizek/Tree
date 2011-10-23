require([
  '../tree' // In development, latest version
  , 'stree' // More stable one, proven to be working
  //, '../lib/jquery/dist/jquery.min'
], function(tree, stree, $) {
  var ptn = tree._helpers._pattern
  stree(ptn).type('function')
  var us = function() {}
  stree(ptn([], 'parallel')).eql('up')
  stree(ptn([
    {_run:true, _done:true, _timeout:false}
  ], 'parallel')).eql('up')
  stree(ptn([
    {_run:false, _done:false, _timeout:false}
  ], 'parallel')).eql('child')
  stree(ptn([
    {_run:false, _done:false, _timeout:false}
  ], 'parallel')).eql('child')
})