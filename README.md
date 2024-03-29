# PlanPals

PlanPals is a tool that takes all the uncertainty out of planning get-togethers, hangouts, events, and occasions! 

[Click to see the demo here!](https://www.plan-pals.com)

## About This Project

The driving philosophy behind PlanPals is __certainty__. 

Has this ever happened to you? Let's say it's summer, and you want to hit the beach with your friends. You ask everyone if they're available and interested, but the conversations never result in anything concrete. And suddenly, the seasons change and you've missed your opportunity to enjoy a nice beach day.

Or, maybe you want to host a gift exchange with your extended family over the winter holidays. You ask around for a possible day that could work. Some are out of town. Others are busy. Once again, time passes, and plans fall through in the end. 

<img src="https://media.tenor.com/YqmVYr-_c8QAAAAC/itysl-happened.gif">

Making plans these days is difficult! Trying to maneuver around schedules, especially when more and more people are involved, can be extremely frustrating and puzzling. The goal of PlanPals is to take away that frustration by encouraging concrete details, proactive planning, and clear communication -- all on a simple, modern platform. 

## Technical Overview

This project is built on the MERN stack: MongoDB (Mongoose), Express, React, and Node. I'm using the MaterialUI component library, React Query for fetching, and Jest for testing. Also essential to this project is [this multi-date picker library](https://shahabyazdi.github.io/react-multi-date-picker/).

## Update Log
### January 7, 2023
A notification system has been implemented, though right now only for actions rather than things like scheduled reminders. For UX purposes, I've refactored the group page so that it's viewable when logged out and signing in will redirect the user back to the group page. This allows for sharing links for new users and letting them join as smoothly as possible. 

### January 3, 2023
I expect that the app will be used quite a bit on mobile phones. Rather than ship new features, I decided to switch gears and focus on making the app more user friendly. I've integrated Google sign-in and refactored all components to be responsive. 

### December 25, 2022
Passwords can now be reset via emails. Due to the complexity and potential cost of having a dedicated mail server, I'm temporarily using Gmail as a transport. 

### December 20, 2022
Photo uploading functionality implemented using AWS S3. I also refactored away from loading backdrops into skeletons to smoothen the overall experience.

### December 15, 2022
With the basic app more or less complete, I'll be setting up a simple CI/CD pipeline as I continue to work on more features. 

### December 5, 2022

My immediate short-term goal is to complete a skeleton CRUD app with user, group, and hangout models working together in an extremely simple fashion. I need to make sure that the foundational pieces have no bugs or issues before moving on to more specific features. 

### List of features to implement:
* ~~Date selection. A planner has the option to pick multiple dates for a hangout. Attendees should be able to select the dates that they're available based off that.~~ (Completed: 12/15/2022)
* ~~Reset password functionality using Nodemailer as an email sender~~ (Completed: 12/25/2022 🎄)
* ~~Photo uploads~~ (Completed: 12/19/2022)
* Privacy and security. All groups should be invite-only. Admin-type users should be able to remove other users.
* User page to change avatars or update personal information
* ~~Notifications~~ (Completed: 1/6/2022) 
* ~~OAuth~~ (Completed: 12/28/2022)


