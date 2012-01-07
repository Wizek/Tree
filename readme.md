# Introduction
## Why?
I got fed up with QUnit which I was using to test the client side of one of my projects. It prove to be very unreliable when it came to async handling. I looked around for alternatives, and to my suprise, I couldn't find anything more satisfying than what I was already using. Then came the idea: What if I'd write my own Unit Testing framework for JavaScript?

## How?
- I should be able to trust it -- it needs to operate in a stable and reliable manner.
- It should have all the benefits of the frameworks I've already tried, with some addition I've always missed.
- It should look gourgeous, as I'll be looking at it a whole lot of times.

## What?
I didn't want to do it first, but I liked the vision so much on how it all will come together that after a while I've been dragged in and built **Tree.js**.

- Trust: It's a unit-tested Unit Testing framework. You can check out the tests in the test folder, and run them if you will. If you still manage to find a bug in spite all this effort, I'd love to pull your proposed testcases/asserts maybe along with the fixed code itself.
- Functionality: See highlights below.
- Look & Feel: [See it for yourself](http://content.screencast.com/users/W1z3k/folders/Jing/media/d4729fb0-bbcd-4e85-bf14-75ea12f5861c/2011-10-04_1159.png).

![Tree.js logo](http://i.imm.io/dG0a.png)
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
 - `✓` Organize as much as you want into a tree, e.g. for following the structure of your app
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
	tree(1).eql(2)
	tree.done(1)
</script>
```
When you run this, of course, it's gonna fail, because 1 === 2 is false.

Let's grow a branch! (html markup is the same, only writing js part)

```javascript
tree.branch('Name of the branch', function(tree) {
	tree(1).eql(2)
	tree.done(1)
})
tree.done(0)
```

Let's do that 2 more times.

```javascript
tree.branch('Name of the first outer branch', function(tree) {
	tree.branch('Name of the one inside the first outer brnach', function(tree) {
		tree(23).type(number)
		tree.done(1)
	})
	tree.done(0)
})
tree.branch('Name of the second outer one', function(tree) {
	tree(1).not.eql(2)
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

# tl;dr
We are building the best JavaScript unit testing framework. Wanna join? Or, you can just use it too...

# License
(The MIT License)

Copyright (c) 2011-2012 Nagy Milán "Wizek" <123.wizek@gmail.com>

Permission is hereby granted, free of charge, to any person obtaining a copy of this software and associated documentation files (the 'Software'), to deal in the Software without restriction, including without limitation the rights to use, copy, modify, merge, publish, distribute, sublicense, and/or sell copies of the Software, and to permit persons to whom the Software is furnished to do so, subject to the following conditions:

The above copyright notice and this permission notice shall be included in all copies or substantial portions of the Software.

THE SOFTWARE IS PROVIDED 'AS IS', WITHOUT WARRANTY OF ANY KIND, EXPRESS OR IMPLIED, INCLUDING BUT NOT LIMITED TO THE WARRANTIES OF MERCHANTABILITY, FITNESS FOR A PARTICULAR PURPOSE AND NONINFRINGEMENT. IN NO EVENT SHALL THE AUTHORS OR COPYRIGHT HOLDERS BE LIABLE FOR ANY CLAIM, DAMAGES OR OTHER LIABILITY, WHETHER IN AN ACTION OF CONTRACT, TORT OR OTHERWISE, ARISING FROM, OUT OF OR IN CONNECTION WITH THE SOFTWARE OR THE USE OR OTHER DEALINGS IN THE SOFTWARE.