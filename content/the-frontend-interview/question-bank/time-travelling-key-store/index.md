---
title: Time Travelling Key Store
date: "2021-02-01T00:00:00.000Z"
published: true
description: Create a data structure that supports a changing value over time
category: build-a-component
---

## Prompt

### Part 1

Create a data store that supports get and set methods.

```javascript
const store = new Keystore()
store.set("name", "Guy")
store.get("name") // 'Guy'
```

### Part 2

Expand the previous step to set a time the value was stored, and a lookup of a value at an exact time. i.e. `store.get('name', 1230)`

### Part 3

- Expand to now support fuzzy searching ( when specified a timestamp, return a value if it had been set BEFORE that timestamp )
- Clarification: return undefined if no time had been set before
- Clarification: linear lookup time is fine initially, but know you could reduce to nlog(n) with binary search
  - Gotcha: When testing since we're using an actual clock, we'll need to either mock out Date.now

## Solution

### Part 1 Variation

This component is pretty trivial, something like this will get you started

```javascript
class Store {
  constructor() {
    this._store = new Map()
  }
  get(key) {
    return this_store.get(key)
  }
  set(key, value) {
    return this_store.set(key, value)
  }
}
```

### Part 2 Variation

Implementation varies from the codesandbox, instead of storing a Value[], store them in a map for constant time lookups

- `this._values = Map<key, Map<timestamp, value>>`

<div class="full-bleed"></div>

[Time Travelling Key Store](embedded-codesandbox://time-travelling-key-store)

## Clarifying Questions

### Part 1

- What should be returned what the key does not have a stored value? Return `undefined`
- Any time complexity constraints on the lookup? Should be constant time.

### Part 2

- What should be returned when a key does not exist at the exact time? Return `undefined`
- Anything that should be returned from the `set` method? Return the time that a value was stored ( useful for testing too )
- Any preference on date value that is stored? Can use `Date.now()` for an easily comparable value
- What should be returned when there is no date value provided in `get`? Return last set value when timestamp

### Part 3

## Evaluation Criteria

- Are you able to walk through the ideal data structures for each incremental requirement ( including storing `date` and `time` for each value )
- Are you able to describe some expected patterns for return values? i.e. undefined for a value that has not been set, vs returning `null` vs throwing an error
- Are you able to write tests to describe the expected behaviour? How do you tackle the async nature of the `Date.now` being a dependency? Could wait between tests with a setTimeout, but that will slow the tests down a large amount.
