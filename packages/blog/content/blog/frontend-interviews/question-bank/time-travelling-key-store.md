---
title: Time Travelling Key Store
date: "2021-02-01T00:00:00.000Z"
draft: false
description: Create a data structure that supports a changing value over time
tags:
  - interview
---

## Prompt

### Part 1

Create a data store that supports get and set methods.

```javascript
const store = new Keystore();
store.set("name", "Guy");
store.get("name"); // 'Guy'
```

### Part 2

Expand the previous step to set a time the value was stored, and a lookup of a value at an exact time.

```javascript
const store = new Keystore();
const timeStored = store.set("name", "Guy");
store.get("name", timeStored); // 'Guy'
```

### Part 3

Expand to now support fuzzy searching ( when specified a timestamp, return a value if it had been set BEFORE that timestamp )

```javascript
const store = new Keystore();
const timeStoredGuy = store.set("name", "Guy");
// Wait 10 seconds
store.set("name", "James");
store.get("name", timeStoredGuy + 1); // 'Guy'
```

## Solution

### Part 1

This component is pretty trivial, something like this will get you started

```javascript
class Store {
  constructor() {
    this._store = new Map();
  }
  get(key) {
    return this._store.get(key);
  }
  set(key, value) {
    return this._store.set(key, value);
  }
}
```

### Part 2

Implementation varies from the codesandbox, instead of storing a Value[], store them in a map for constant time lookups

- `this._values = Map<key, Map<timestamp, value>>`

### Part 3

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

- What should be returned if there are no entries before a given timestamp? Return `undefined`
- Are there any time complexity constraints? Linear lookup time is fine initially, but how would you optimize further? Binary search since it's a sorted list
- Any preference to how we test this async nature? We could wait, but that will slow our tests. Better to mock out Date.now

## Evaluation Criteria

- Are you able to walk through the ideal data structures for each incremental requirement ( including storing `date` and `time` for each value )
- Are you able to describe some expected patterns for return values? i.e. undefined for a value that has not been set, vs returning `null` vs throwing an error
- Are you able to write tests to describe the expected behaviour? How do you tackle the async nature of the `Date.now` being a dependency? Could wait between tests with a setTimeout, but that will slow the tests down a large amount.
