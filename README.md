# Pelvic Strength

Create a clean, modern mobile application called "Stamina Trainer".



The app is designed to help men strengthen their pelvic floor (Kegel) muscles through a structured 90-day training program.



The design should be minimal, premium, and distraction-free, using dark colors with subtle blue accents. The app should feel calm, professional, and motivating.



MAIN STRUCTURE



The app contains 20 levels.



The user starts at Level 1 and progresses to Level 20 over approximately 90 days by completing one workout every day.



Each level contains two different exercises:



1. Hold (Contract)

2. Push



The exercise duration gradually increases as the user progresses.



HOME SCREEN



Display:



- Current Level

- Current Day

- Progress bar toward Level 20

- Large circular countdown timer in the center

- Large START button

- Total completed workouts

- Streak counter



When the user presses START, the workout begins.



WORKOUT FLOW



Each workout consists of two phases.



PHASE 1 – HOLD (Contract)



The user repeatedly contracts the pelvic floor muscles.



Each phase consists of 6 work blocks.



Example Level 1:



Work 5 seconds

Rest 5 seconds



Repeated 6 times.



During the work period display:



"HOLD"



During the rest period display:



"RELAX"



The countdown timer should animate smoothly.



Use vibration or sound when switching between work and rest.



After Phase 1 is completed, automatically continue to Phase 2.



PHASE 2 – PUSH



Now the instruction changes.



Instead of contracting, the user gently pushes the pelvic floor muscles downward.



Again:



6 work blocks



Example:



Push 5 seconds



Rest 5 seconds



Repeated 6 times.



During work display:



"PUSH"



During rest display:



"RELAX"



At the end show:



Workout Complete



Congratulations!



+1 Daily Workout



LEVEL PROGRESSION



The work duration gradually increases across all 20 levels.



Example progression:



Level 1

Hold 5 sec

Rest 5 sec



Level 2

Hold 6 sec

Rest 5 sec



Level 3

Hold 7 sec

Rest 5 sec



...



Continue increasing until approximately:



Level 20



Hold 30 sec



Rest 10 sec



The Push exercise follows the same progression.



The increase should feel smooth and achievable over 90 days.



PROGRESS



The app automatically unlocks the next level after the required number of completed workouts.



Display:



Completed Levels



Current Level



Days Completed



Completion Percentage



Longest Streak



FEATURES



- Large animated circular countdown timer

- Beautiful transitions

- Smooth countdown animations

- Vibration at every interval change

- Dark mode interface

- Offline functionality

- Save progress locally

- Daily reminder notification

- Motivational completion screen



DESIGN STYLE



Minimal



Premium



Masculine



Dark background



Blue accent color



Large typography



Simple navigation



No unnecessary screens.



The timer should always be the main focus.



The user should always know:



- what to do,

- how many seconds remain,

- which block is currently active,

- and how much of the workout is completed.



The experience should feel like a professional fitness training app.



Build this as a complete mobile application with reusable components, clean architecture, responsive layout, and production-quality UI.

This project was built with [Lovable](https://lovable.dev).

**Live app**: https://pelvic-pulse-program.lovable.app

## Build with Lovable

Continue developing this project in the [Lovable editor](https://lovable.dev/projects/f95ebb92-9d58-4d29-9ab9-6260a8625178).

- **Ship faster**: describe what you want to build and Lovable handles the code.
- **Stay in sync**: every change made in Lovable is committed straight to this repository.
- **Full ownership**: this code is yours. Push to `main` on GitHub and your changes sync back into Lovable, ready for your next prompt.

## Development

Prefer working locally? You need Node.js and npm — [install with nvm](https://github.com/nvm-sh/nvm#installing-and-updating).

```sh
git clone <this-repository-url>
cd <repository-name>
npm i
npm run dev
```
