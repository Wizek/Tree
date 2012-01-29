# Introduction
## Why?
I got fed up with QUnit which I was using to test the client side of one of my projects. It proved to be very unreliable when it came to async handling. I looked around for alternatives and to my surprise, I couldn't find anything more satisfying than what I was already using. Then came the idea: What if I'd write my own Unit Testing framework for JavaScript?

## How?
- I should be able to trust it -- it needs to operate in a stable and reliable manner.
- It should have all the benefits of the frameworks I've already tried, with some addition I've always missed.
- It should look gorgeous, as I'll be looking at it a whole lot of times.

## What?
I didn't want to do it first, but I liked the vision so much on how it all will come together that after a while I've been dragged in and built **Tree.js**.

- Trust: It's an unit-tested Unit Testing framework. You can check out the tests in the test folder, and run them if you will. If you still manage to find a bug in spite all this effort, I'd love to pull your proposed test cases/asserts maybe along with the fixed code itself.
- Functionality: See highlights below.
- Look & Feel:

[![See it for yourself](http://content.screencast.com/users/W1z3k/folders/Jing/media/af054bca-bbbb-4634-8431-eab8a1a04607/2012-01-29_2222.png)](http://jsfiddle.net/KeREY/)

# [Try it out online now!](http://jsfiddle.net/KeREY/)

# Current highlights
> `✓` (cross) marks completed feature.<br>
> `•` (dot) means work in progress/partially done.<br>
> `_` (empty/underscore) means planned/proposed feature, which awaits sedulous hands.

 - `✓` Works in the browser
 	- `✓` Works in AMD environment
 	- `✓` Works with script tags too
 - `_` Works with Node.js `// shouldn't be hard to implement.`
 - `✓` Handles async code as never before
 	- `✓` Assert counting
 	- `✓` Easily go back and forth between
 		- `✓` Parallel execution
 		- `✓` Serial execution
 - `✓` Expressive syntax
 - `✓` Looks wonderful in the browser
 	- `✓` Only shows you those asserts that require your attention, and doesn't bother you with the rest. But you can browse them too, if you ever wanted.
 - `•` Looks.. Nice in the console.
 	- `_` You can choose how verbose you want it to be
 - `✓` Write as little as you want with the least effort
 - `✓` Organize as much as you want into a tree, e.g., for following the structure of your app
 - `•` Many more!

# Quick Start Guide
Download the latest release from [here](https://github.com/Wizek/Tree/downloads).
This is all the markup you are going to need (if you use good old script tags):

```html
<!doctype html>
<!-- jQuery won't be a dependency for long -->
<script src="/path/to/jquery.js"></script>
<script src="/path/to/tree.js"></script>
<body></body>
<script type="text/javascript">
	tree(1).is(2)
	tree.done(1)
</script>
```
When you run this, of course, it's gonna fail, because `1 === 2` is false.

Let's grow a branch! (html markup is the same, only writing js part)

```javascript
tree.branch('Name of the branch', function(tree) {
	tree(1).is(2)
	tree.done(1)
})
tree.done(0)
```

Let's do that 2 more times.

```javascript
tree.branch('Name of the first outer branch', function(tree) {
	tree.branch('Name of the one inside the first outer branch', function(tree) {
		tree(23).type(number)
		tree.done(1)
	})
	tree.done(0)
})
tree.branch('Name of the second outer one', function(tree) {
	tree(1).not.is(2)
	tree.done(1)
})
tree.done(0)
```

Did you notice that you can declare branches within another branch? This helps you to organize your tests into a tree (hence the name Tree.js). It has neat output too!

That should be enough to get you started. For more see "*Reference guide*" below.
Should you ever need more help, see "*Get in touch*" section below.


# Reference guide (WIP)
## Three (3) loading modes supported!
### Browser: Traditional
```html
<!-- jQuery won't be a dependency for long -->
<script src="path/to/jquery.js"></script>
<script src="path/to/tree.js"></script>
<script> /* ... */ </script>
```
### Browser: AMD
```html
<script>
require(['tree'], function(tree) {
	/* ... */
})
</script>
```
### Node.js: require (WIP)
```javascript
var tree = require('path/to/tree.js')
/* ... */
```
## Asserts
### Strict (triple) equal `a === b`
```javascript
tree('foo').is('foo') // passes
tree(1).is('1') // fails
tree(1).is(2) // fails
```
### Loose (double) equal `a == b`
```javascript
tree('foo').is('foo') // passes
tree(1).is('1') // passes
tree(1).is(2) // fails
```
### Truthy `!! a`
```javascript
tree('foo').ok() // passes
tree(0).ok() // fails
tree(null).ok() // fails
```
### Type `typeof a === b` + some magic
```javascript
tree('str').type('string') // passes
tree(function(){}).type('function') // passes
tree(1).type('string') // fails
tree([]).type('array') // yep, this passes
```
### Always passing assert - Doesn't take arguments.
```javascript
tree().pass() // passes
```
### Always failing assert - Doesn't take arguments.
```javascript
tree().fail() // fails
```
### Check for exception
```javascript
var Fn1 = function(){throw new Error()}
var Fn2 = function(){}
tree(Fn1).throws() // passes
tree(Fn2).throws() // fails
```
### Deep equal - compare two objects and their properties recursively
```javascript
tree([1,2]).deepEql([1,2]) // passes
tree({a:1,b:[22,33]}).deepEql({a:1,b:[22,33]}) // passes
tree({a:1,b:[22,33]}).deepEql({a:1,b:[22,34]}) // fails
```
## Negation `!`
You can use `.not.` on any assert to negate their result.

```javascript
tree('123').not.is(123) // passes
tree(function(){}).not.throws() // passes
tree('123').not.like(123) // fails
```
## Branching
Organize your asserts into a nice tree

```javascript
tree.branch('Name these', function(tree) {
	tree.branch('whatever', function(tree) {
		/* ... */
	})
	tree.branch('you', function(tree) {
		tree.branch('want!', function(tree) {
			/* ... */
		})
		/* ... */
	})
	/* ... */
})
```
## Async handling
### Assert count
```javascript
tree.branch('this branch passes', function(tree){
	tree.done(0)
})
tree.branch('this passes too', function(tree){
	tree(true).ok()
	tree.done(1)
})
tree.branch('this fails', function(tree){
	tree(true).ok()
	tree(true).ok()
	tree.done(1)
})
// If you want to be more explicit you can also use tree.expect(\d)
// to say how many asserts you expect to run within the current branch
tree.branch('more explicit expect', function(tree){
	tree.expect(1)
	tree(true).ok()
	tree.done()
})
tree.done(0)
```
### Serial execution by default
```javascript
tree.branch(function(tree) {
	// executes 1st
	setTimeout(function() {
		// executes 3rd
		tree.done(0)
	}, 100)
	// executes 2nd
})
tree.branch(function(tree) {
	// executes 4th
	setTimeout(function() {
		// executes 6th
		tree.done(0)
	}, 100)
	// executes 5th
})
// starts execution
tree.done(0)
```
### Set parallel execution
```javascript
tree.heritable.config({parallel:true})
tree.branch(function(tree) {
	// executes 1st
	setTimeout(function() {
		// executes 5th
		tree.done(0)
	}, 100)
	// executes 2nd
})
tree.branch(function(tree) {
	// executes 3rd
	setTimeout(function() {
		// executes 6th
		tree.done(0)
	}, 200)
	// executes 4th
})
// starts execution
tree.done(0)
```
### Switch between parallel/serial on the fly with .waitForDone() and .fireNextToo()
```javascript
tree.heritable.config({parallel:true})
tree.branch('waiter', function(tree) {
	tree.waitForDone()
	// executes 2nd
	setTimeout(function() {
		// executes 4th
		tree.done(0)
	}, 100)
	// executes 3rd
})
tree.branch('rusher', function(tree) {
	tree.fireNextToo()
	// executes 5th
	setTimeout(function() {
		// executes 8th
		tree.done(0)
	}, 100)
	// executes 6th
})
tree.branch('whatever', function(tree) {
	// executes 7th
	tree.done(0)
})
// executesn 1st
tree.done(0)
```
### Timeout handling
Each branch has exaclty 1000 milliseconds by default to signal their finish with `tree.done()`. Should they time out they are considered failing. Default timeout value can be changed with `tree.cfg('timeout', value)`

```javascript
tree.branch("I'm in time :)", function(tree) {
	tree.waitForDone()
	setTimeout(function() {
		tree.done(0)
	}, 600)
})
tree.branch('I time out :(', function(tree) {
	setTimeout(function() {
		tree.done(0)
	}, 1200)
})
tree.branch("I take very long to run but it's normal.", function(tree) {
	tree.config({timeout:3000})
	setTimeout(function() {
		tree.done(0)
	}, 2600)
})
// executes 1st
tree.done(0)
```

# Get in touch
For bug reports, feature requests and love letters choose an option most suitable for your liking:

- IRC: on Freenode usually in ##javascript and #Node.js under the handle `Wizek`
- GitHub: @Wizek
- Email: <123.wizek@gmail.com>

# tl;dr
We are building the best JavaScript unit testing framework. Wanna join? Or, you can just use it too...


# License
(The MIT License)

Copyright (c) 2011-2012 Nagy Milán "Wizek" <123.wizek@gmail.com>

Permission is hereby granted, free of charge, to any person obtaining a copy of this software and associated documentation files (the 'Software'), to deal in the Software without restriction, including without limitation the rights to use, copy, modify, merge, publish, distribute, sublicense, and/or sell copies of the Software, and to permit persons to whom the Software is furnished to do so, subject to the following conditions:

The above copyright notice and this permission notice shall be included in all copies or substantial portions of the Software.

THE SOFTWARE IS PROVIDED 'AS IS', WITHOUT WARRANTY OF ANY KIND, EXPRESS OR IMPLIED, INCLUDING BUT NOT LIMITED TO THE WARRANTIES OF MERCHANTABILITY, FITNESS FOR A PARTICULAR PURPOSE AND NONINFRINGEMENT. IN NO EVENT SHALL THE AUTHORS OR COPYRIGHT HOLDERS BE LIABLE FOR ANY CLAIM, DAMAGES OR OTHER LIABILITY, WHETHER IN AN ACTION OF CONTRACT, TORT OR OTHERWISE, ARISING FROM, OUT OF OR IN CONNECTION WITH THE SOFTWARE OR THE USE OR OTHER DEALINGS IN THE SOFTWARE.