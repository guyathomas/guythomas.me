---
title: Analogue Clock
date: "2021-02-01T00:00:00.000Z"
draft: true
description: Create a real-time analogue clock
tags:
  - interview
---

## Prompt

Create an analogue clock that will show the system time and update at least every second.

## Solution / Demo

[Analogue Clock](embedded-codesandbox://analogue-clock)

## Clarifying Questions

- Are there any other label positions required, or just 3,6,9,12? Those ones are fine, no need to make dynamic classes to allow for all positions.
- Can I search date / transform API? Yes

## Evaluation Criteria

- Separation of components/modules

  - Calculating the time variables
  - Hand component
  - Digit component

- Remove event listener on unmount
- Are they able to explain how they would change the API for the clock component if it should support static times too?
