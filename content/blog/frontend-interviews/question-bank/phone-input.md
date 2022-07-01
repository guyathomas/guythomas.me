---
title: Phone Input
date: "2021-02-01T00:00:00.000Z"
published: true
description: Create a phone input that will format a number US phone number formatting
category: build-a-component
---

## Prompt

Create a phone input component that will format a users input

## Solution / Demo

[Phone Input](embedded-codesandbox://phone-input)

## Clarifying Questions

- Should it be a controlled component?
- Should the user be required to provide a formatted number string, a raw string, or a number? What should they get out of the input? A formatted number, or raw number.
- What functionality should work? Typing? Backspacing? Pasting? All should.
- Should it support alternate country formats?
- What should happen when a non-numerical number is input?
- When i press backspace and the previous character is a formatting character, should it be deleted? Yes

## Evaluation Criteria

- Defines a clear API for this component and can justified their answers for the clarifying questions.

- Works with the desired functionality

## Edge Cases

Typing in the middle of a string will cause the cursor to jump to the end. Can they explain at a high level why this happens? Can they walk you through how they would attempt to fix it? Answer is that when we replace the content of the input field, react does not know where to set the cursor - so it places it at the end of the input. Fix is to onKeyDown save the cursor position, and then set it to the correct position after the new value has been input.

They don't have to actually implement the fix, since it can get pretty gnarly.
