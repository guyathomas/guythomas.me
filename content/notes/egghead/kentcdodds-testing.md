---
title: Testing Course
date: "2020-07-12T20:39:13.695Z"
description: "Notes from https://testingjavascript.com/"
tags: ["notes"]
---

# Testing Course

## Testing Fundamentals

### Writing a testing library

```javascript
const sum = (a, b) => a + b
const subtract = (a, b) => a - b

const result = sum(3, 7)
const expected = 10

// Fundamentally, as test is just logic that will report when a result is not equal to the expected result
if (result !== expected) {
  // highlight-next-line
  throw new Error(`${result} is not equal to $${expected}`)
}
```
