---
title: Seven Segment LED
date: "2021-02-01T00:00:00.000Z"
published: true
description: Create a real-time 7 segment LED
category: build-a-component
---

## Prompt

A seven-segment display is a form of electronic display device for displaying decimal numerals. Seven-segment displays are widely used in digital clocks.

Make a digital clock that represents current time in a UI similar to this image.

![Seven Segment](./seven-segment-clock.png)

## Solution / Demo

<div class="full-bleed"></div>

[Seven Segment Clock](embedded-codesandbox://seven-segment-clock)

## Clarifying Questions

- 12-hour or 24-hour clock? 24-hour.
- Can HTML/SVG/Canvas/Flexbox/WebGL be used? Any frontend rendering technology is okay.
- How should single-digit numbers be formatted (like the "1" in "1:00")? The tens digit should be a zero: "01:00"
- Does the colon need to be rendered? Optional, if there's time at the end.
- How accurate should the clock be? Update at least every second.

## Evaluation Criteria

- Using a map of on/off states for each number
- Recognizing the digit component and re-using it instead of repeating code
- Using Date object properly ( looking at docs is fine )
- Clearing up the interval once component is deleted
