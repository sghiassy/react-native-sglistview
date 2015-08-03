# React Native SGListView

SGListView is memory minded implementation of the React Native's ListView.

## The Problem

The React Native team has done a tremendous job building a robust platform. One oversight is the memory performance of their ListView implementation.

Using React Native's UIExplorer app, if we scroll the ListView paging example down to the 99th row, we can that memory continually increases as the list view's size and number of rows increases.

On a memory-constrained mobile device, this behavior can be a deal breaker for many.

![Native ListView Performance](http://cl.ly/image/0K2E4047352Z/ListView-196.png.png)

## The Solution

SGListView resolves React Native's ListView memory problem by better controlling what's being drawn to the screen. Replaying the example above, this time swapping `ListView` for `SGListView` we can see that memory has been kept in check.

  * #### React Native ListView ended at: 405MB
  * #### React Native SGListView ended at: 158MB

![SGListView Performance](http://cl.ly/image/07190k0r041B/JSListView-196.png)

### Points of Note

It should be noted that SGListView

## Installation

## Usage

## FAQ

### Why didn't you wrap a UICollectionView/UITableView?

## Authors
