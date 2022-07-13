---
title: A common pattern to System Design interviews
date: "2021-02-01T00:00:00.000Z"
draft: true
description: "A step by step process to approaching system design interviews"
---

# A systematic approach to System Design interview questions

```
A large eCommerce company wishes to list the best-selling products, overall and by category. For example, one product might be the #1056th best-selling product overall but the #13th best-selling product under "Sports Equipment" and the #24th best-selling product under "Safety:·
Source: CTCI
```

## Define Ambiguity in the question

There are terms in the sentence that are intentionally ambiguous, lets clarify what they mean.

- How big is `a large eCommerce company`
- What defines `best-selling` is it total sales volume? Total sales $? Total sales in past year?
- What does `product` look like? Should we track a variation of a product separately? i.e. For a given t-shirt, will the different colors be different products?
- What is a `category` can it have sub-categories?

## Define user stories

- Who, What, When, Why, How
- How is data entered and retrieved from the system

Jane, who is looking to buy a friend a t-shirt ( who ) for christmas ( when ) will search the name of a product in a search bar ( how ) and get a list of the top 10 most popular items ( what ). She wants the top selling items because she is not sure what her friend will want, and so will want the items that the system knows are most popular ( why ).

On purchasing an item ( when ) the system ( who ) should update a value ( what ) for future reference in ranking most popular ( why ). How is not relevant yet, we haven't designed that aspect.

## Scope the problem

What part of the system is `in scope` and what parts are `out of scope` that we can assume are already built.

- Can we assume the billing system is built, the customer / auth system, etc? The part that is `in scope` is
  - Incrementing values used to derive `popular`
  - Retrieving those values
