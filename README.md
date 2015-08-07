# React Native SGListView

SGListView is a memory minded implementation of the React Native's ListView.

## The Problem

The React Native team has done a tremendous job building a robust platform. One oversight, is the memory performance of their ListView implementation. When scrolling down long lists, the memory footprint increases linearly and will eventually exhaust all available memory. On a device as memory-constrained as a mobile device, this behavior can be a deal breaker for many.

![Native ListView Performance](http://cl.ly/image/1E1Q2M2x1Y3F/Before.png)
An example of ListView performance for long lists.

## The Solution

SGListView resolves React Native's ListView memory problem by controlling what's being drawn to the screen and what's kept in memory. When cells are scrolled off screen, SGListView intelligently flushes their internal view and only retain the cell's existing bounding box - resulting in huge performance and memory gains.

  * React Native ListView scrolling down 200 rows took: **405MB**
  * React Native SGListView scrolling down 200 rows took: **158MB**

![SGListView Performance](http://cl.ly/image/3e2y0a1C1n0K/After.png)
An example of SGListView performance for long lists.


## Installation

Install via npm

```
npm install XXX --save (to be updated)
```

## Usage

SGListView was designed to be a developer-friendly drop-in replacement for ListView. Simply import the package and change references to `ListView` to `SGListView`. Nothing else. No fuss, no muss.

Import SGListView

```
var SGListView = require('SGListView');
```

Change references from `ListView` to `SGListView`.

From:
```
<ListView ... />
```
To:
```
<SGListView ... />
```

Done.

## Options

  * **premptiveLoading**: SGListView will dump the internal view of each cell as it goes off the screen. Conversely, when the cell comes back on the screen, we repopulate the cell with its view. If this transition happens too late in the process, the user will see a flash on screen as the cell transitions from a blank bounding box to its full view representation. SGListView prevents this from happening by preemptively loading cells before they come on screen. By default, we load 2 cells in the future before they come on screen. SGListView allows you to override the number of cells to load preemptively through the prop *premptiveLoading*. **Note**: Because of this logic, its advised not to use ListView's prop *scrollRenderAheadDistance* as they can be in conflict with one another.

## FAQ

### Does this approach reuse cells?

Unfortunately no. Instead what SGListView does is to dump the internal view of cells as they scroll off screen, so that only a simple bounding box of the cell remains in memory.

### Why do you keep cells around when they go off screen? Why don't you just remove them?

We keep cells around because we wanted SGListView to be a high-fidelity drop-in replacement for ListView - which meant sacrificing performance for compatibility.

We wanted pixel perfection between ListView and SGListView. This meant that we had to rely on ListView's underlying CSS engine to keep pixel level fidelity between ListView layouts and SGListView layouts. With flexbox styling, removing a cell from a grid can cause a reflow of all remaining cells and therefore could mess with design fidelity; keeping the bounding box resolved any and all layout concerns.

### Why didn't you wrap a UICollectionView / UITableView?

One key goal for this project was to make the final solution platform independent. Using an underlying UICollectionView or UITableView would've tied the implementation to Apple and was something we worked to avoid.

## Authors

Shaheen Ghiassy <shaheen.ghiassy@gmail.com>
