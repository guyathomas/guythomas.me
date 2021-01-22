---
title: Behind the decision making in a tech interview
date: "2021-01-21T00:00:00.000Z"
published: false
description: "In depth walk-through of the incentives of stakeholders and hidden decisions in a tech interview process"
---

# [DRAFT] The _people_ side of tech interviews

It's no surprise that [tech interviews are broken](https://about.gitlab.com/blog/2020/03/19/the-trouble-with-technical-interviews/). They are wrought with bias, ego and tests that give no indication for real world performance. While I don't have a solution, I want to provide assistance in navigating this bias.

This article will NOT cover the technical parts of the process since they are covered in all over the web [Full-stack / generalist](https://www.freecodecamp.org/news/software-engineering-interviews-744380f4f2af/), [frontend](https://medium.com/@chen.reuven/the-ultimate-study-guide-for-front-end-interview-776fa3ead1b3) and [system design](https://www.evernote.com/shard/s576/client/snv?noteGuid=75fbe53c-baed-47ca-9f58-a44038c63468&noteKey=05d51df458ea2cff&sn=https%3A%2F%2Fwww.evernote.com%2Fshard%2Fs576%2Fsh%2F75fbe53c-baed-47ca-9f58-a44038c63468%2F05d51df458ea2cff&title=2.%2BSystem%2BDesign%2BInterviews%2B-%2BWHERE%252C%2BWHAT%252C%2BHOW). This article will cover the motives of people involved at each step, and how to work with those motives.

## Raw application

The recruiter has a lot of resumes. They need to filter on something, if they let you past this stage, the time spent on you increases exponentially. They want to avoid wasting this time.

- Make the resume nice. Don't do a Google doc template. [The Standard Resume](https://standardresume.co) is a great service with a freemium model.
- Tailor your resume to buzzwords out of the job posting. The recruiter has had a brief with the hiring manager on what they need in this role, and they've likely included that in the job posting. This is costly as far as time investment goes, so if your objective is getting applications out the door, a single, well polished resume will be fine.
- Outline ANY relevant tech experience. If you were customer success agent before, but wrote some basic SQL - outline that! If you were a bartender, leave it off. It's not relevant. If you're lacking sufficient relevant experience, include side projects and open source software you've done - ideally these involved collaboration with others. [The Tech Resume](https://thetechresume.com/) does a great job at going into depth here.
- If you know anyone at the company, hit them up for a referral BEFORE you try to go through the front door.

## Recruiter Screen

The recruiter is aiming to filter out candidates that they think will not pass a tech screen or the onsite. Passing candidates through from this stage who fail miserably at the tech screen stage looks bad on the recruiter - and if this happens can cause tension between eng and recruiting. The trouble is, the recruiter doesn't always have technical knowledge to be able to adequately assess a candidate. So they need to rely on other proxys.

- Trivia Questions - Sometimes they will ask trivia questions, and looking for keywords in the response. So try say something, anything you know about the topic - but don't ramble, this will be a red flag. [This](https://javascript.info/) is a great resource for JS trivia, although it's pretty lengthy - the content is good to know too.
- Cultural questions - Prepare by reading some blog posts and their culture doc. They may ask you questions about their culture, but even if they don't you can be sure they are familiar with the culture doc themselves, so telling them `why` you're aligned with that is a win
- They are going to ask you `Why <insert_company_name>`. Prepare this pitch, don't say `the money` or `the prestige`. You can reference the culture again if you want, if you got referred now is a good time to say `I was speaking with a friend who works here and they loves it there` ( pro tip: you should actually call that friend and actually ask why they like it there. ). Alternatively you could also speak about why you like the industry, and why you think this company stands out in the industry - relating this back to their values is always a good one.
- Have a question or 2 about the company that is more exciting than `what tech stack do they use` - and something that the recruiter will be able to answer ( i.e. don't ask them about what issues they encountered using elastic search ). Some good examples are `can you tell me about some of the projects that this team is working on right now?` and `so i know this company is doing x at the moment. Where is the future direction? Getting deeper into x or spreading out into different fields?`

If you get a no - ask for feedback for anything to improve upon because you still want to work at this company when you're next eligible ( will usually be 6-12 months ).

## Tech Screen

When the engineer passes a candidate from the tech screen, they are committing 4 fellow engineers' time and a manager to talk to you. It's common for them to default NO here if you're on the fence. Obviously you need to do an alright job with the screen, but in my experience the bar isn't too high.

You will freak out at this stage ( I always do ). I find it useful to harness your inner extrovert. This person is evaluating your performance on the interview, and if they could work with you. They will start with a breif intro and then dive into coding. Write down the team that they're on. They will ask you if you have questions at the end - relate this back to their team. i.e. if they're on a team the handles the login flow, ask them about how they handle security concerns from brute force attacks, if they're on the team that built out the core UI library for that team, ask them about how they deploy / version those components for different micro-services to use )

Tips here

- Ask for time to read through and process the problem. Read it twice if you want
- Ask any clarifying questions. Write these in the editor as comments / requirements
- Consider a solution. A naive solution is fine. Try to consider why that wouldn't work.
- Ask the interviewer what they think of this approach
- Start planning your code before writing. This can be through comments, test cases or both.
- Start coding. Do this incrementally. Don't write the whole thing then test once. This will really bite you if there is a bug. You're just increasing the surface area to debug if you do.
- Assert your assumptions `i'm expecting it to perform this way.` If it doesn't - thats fine, a component of this is debugging. They don't expect you to be able to write flawless code the first time. They expect you to be able to diagnose a problem. A common debugging technique is to assert the expected behavior, and then step back where things are not expected until you find the source of the bug.
- If they provide you feedback, be receptive. You don't have to know everything. `You're right! Closures do work that way, thanks for pointing it out` Don't argue with them.

## On-site Tech Interviews

## On-site Behavioral Interviews

## Hiring Review
