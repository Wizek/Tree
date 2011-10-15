# Tree.js
![Tree.js logo](http://i.imm.io/9RKM.png)
# Hey, you!
Yes, *you*! Nice to meet you! Wonderful things are in the works here. Don't go just yet! Because I mean it when I say truly wonderful. Make yourself comfortable, I'll take care of the rest.

Have you thought about what the bestest JavaScript unit testing framework should be like? I have, and I came up with tons of ideas in the process. For example it should look at least as [**pleasant**](http://content.screencast.com/users/W1z3k/folders/Jing/media/d4729fb0-bbcd-4e85-bf14-75ea12f5861c/2011-10-04_1159.png) as QUnit, or better.
It should **handle async code** as good as NodeUnit, or even one bit better-- *Wait a minute! I know those two, but the first is built for testing client side JS, and the latter is for the server side Node.js code!*
--That's exactly my third point my good Sir! How about **unified syntax for both sides**, or even (partially) shared testing suits for all your JS source code? Did I mention it's going to be wonderful?

It's almost as **expressive** as Shouldjs, but doesn't extend the Object object, hence one tiny bit safer, and for those of you who like to be not that much expressive, there are mirror functions. But more importantly it's the whole framework that's built this way.

**It's easy to get into,** whether you come from another framework or you just start with some flavor of TDD. Tree.js works with even just assertions, written sequentially. Tree doesn't force any kind of preset structure on you, but you'll want some organization sooner or later I'm sure. As your app gets more and more complex, you will want to organize your assertions into tests, and make some tests branch out of other tests, branching out of other tests! There you have it: orgainse your asserts/tests into a nice Tree!

To be continued...

## That's a little too much text for me
Okay then, here are some highlights:

- Works with Node.js
- Works in the browser
  - Works in AMD environment
	- Works with script tags too
- Handles async code as never before
	- Assert count
	- Easily go back and forth between
		- Parallel execution
		- Serial execution
- Expressive syntax
- Looks wonderful in the browser
	- Only shows you those asserts that require your attention, and doesn't bother you with the rest. But you can browse them too, if you ever wanted.
- Looks.. Nice in the console.
	- You can choose how verbose you want it to be
- Write as little as you want with the least effort
- Organize as much as you want into a tree, e.g. for following the structure of your app
- Many more!

## tl;dr
We are building the best JS unit testing framework. Wanna join? Or, you can just use it too.

## When?
Are you as excited as I am? Unfortunately, it's not fully done yet. But do not despair as you can speed up that process if you contribute in some way! See Help down below.

### Now
Latest stable version is v0.2 as of 2011.10.12.
This version has all the core functionality, and is stable at performing those in the browser with AMD loading (tested with RequireJS) as you can see as the included test coverage passes.
#### highlights for what is included

- Organise into branches
- core asserts (deepEql, eql, equal, fail, ok, pass, throws, type)
- async handling with serial branch execution only
	- assert count
	- 1000ms timeout for each, continues with next in case of timeout
- linear output to console

#### yet to be included

- See visionary feature list above (*That's a little too much text for me*)

## Help
Do you mean that you help me, or that I help you? (Whatever those pronouns may refer to.)
It's pretty much both! You help me building this framework that will help you greatly with your own projects in return! So, how can you contribute? It's quite early you got here, so you have the privilige to take part even in the designing phase. What's done is the vision. I've done some work with the potential browser UI and the syntax, and also started the core of the framework itself! So, if you are in the mood, get in tuch with me!

## Enough of English already, I want you to talk JavaScript!
Syntax is planned to be the following.
### Three (3) loading modes supported!
#### Node.js: require
```js
var tree = require('tree')
/* ... */
```
#### Browser: AMD
```html
<script>
require(['tree'], function(tree) {
	/* ... */
})
</script>
```
#### Browser: Traditional
```html
<script src="path/to/tree.js"></script>
<script>
/* ... */
</script>
```
### A some assertion types
```js
// Default syntax
tree(123).type('number')
// Negate with .not.
tree({"ob":"ject"}).not.type('string')
// `===` by default
tree(1).not.eql("1")
// `==` if you need it
tree(1).equal("1")
// Etc.. All the core and some convenience assert types
```
### Handles async well
#### Assert count
```js
tree.expect(1) // to ensure all asserts are run
async(function(){ // async() is an arbitrary async function
	tree(x).eql(y)
	tree.done() // to know when all callbacks are back
})
```
#### Run some branches paralell, some in series
```js
// gets to be run 1st
tree.branch('waiter', function(tree) {
	tree.waitForDone()
	// gets to be run 2nd
	setTimeout(function() {
		// gets to be run 4th
		tree.done()
	}, 100)
	// gets to be run 3rd
})
tree.branch('rusher', function(tree) {
	tree.fireNextToo()
	// gets to be run 5th
	setTimeout(function() {
		// gets to be run 8th
		tree.done()
	}, 100)
	// gets to be run 6th
})
tree.branch('rusher 2', function(tree) {
	tree.fireNextToo()
	// gets to be run 7th
	tree.done()
})
```
### Organization
#### Some organising. As much levels as you want. It'll have neat output too!
```js
tree.branch('Name these', function(tree) {
	/* ... */
	tree.branch('whatever', function(tree) {
		/* ... */
	})
	tree.branch('you', function(tree) {
		/* ... */
		tree.branch('want!', function(tree) {
			/* ... */
		})
	})
})
```
#### Want even more control? Load test files on the go, to their appropriate location! They'll be executed as if you wrote them directly there, but this way they are more portable. (Only with AMD, or in Node)
```js
/* ... */
tree.branch('name!', function(tree) {
	/* ... */
	tree.branch('path/to/source.js')
	/* ... */
})
/* ... */
```
### Are you more conservative type? We have the mirror functions for your convinience!
```js
// Standard _______________ oldschool _______________
tree(133).eql(133);         tree.eql(133, 133)
tree(ary).deepEqual(ary);   tree.deepEqual(ary, ary)
tree(foo).not.eql(bar);     tree.notEql(foo, bar)
// I think you get the point.
```
#### More code to come here soon!

## History
How this project came to be? It will be written here.

## That's too little text for me
Drop me a line and I'll be happy to expand the section in question if needs be.

## Contact
Feel free to write me comments, questions, etc here on GitHub or at <123.wizek@gmail.com>.

# License
(The MIT License)

Copyright (c) 2011 Wizek <123.wizek@gmail.com>

Permission is hereby granted, free of charge, to any person obtaining a copy of this software and associated documentation files (the 'Software'), to deal in the Software without restriction, including without limitation the rights to use, copy, modify, merge, publish, distribute, sublicense, and/or sell copies of the Software, and to permit persons to whom the Software is furnished to do so, subject to the following conditions:

The above copyright notice and this permission notice shall be included in all copies or substantial portions of the Software.

THE SOFTWARE IS PROVIDED 'AS IS', WITHOUT WARRANTY OF ANY KIND, EXPRESS OR IMPLIED, INCLUDING BUT NOT LIMITED TO THE WARRANTIES OF MERCHANTABILITY, FITNESS FOR A PARTICULAR PURPOSE AND NONINFRINGEMENT. IN NO EVENT SHALL THE AUTHORS OR COPYRIGHT HOLDERS BE LIABLE FOR ANY CLAIM, DAMAGES OR OTHER LIABILITY, WHETHER IN AN ACTION OF CONTRACT, TORT OR OTHERWISE, ARISING FROM, OUT OF OR IN CONNECTION WITH THE SOFTWARE OR THE USE OR OTHER DEALINGS IN THE SOFTWARE.