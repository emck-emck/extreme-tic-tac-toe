# Extreme Tic Tac Toe

## 2025/08/14
I've done some work on the game, I'm putting it to bed now for a little bit.

The command to compile the code is "ng build"
The command to serve a test environment is "ng serve"
The command to compile for my website is "ng build --configuration production --base-href /extreme_tic_tac_toe/"

The next step in this project would be to make a repetitive learning AI, which I'm sure would trump any I've made so far. In this case, level 2 AI would be replaced by level 3, and the RL AI would become the new level 3.

## 2025/08/09
I am looking at this game for the first time in a year or so. I worked on it somewhat last year, in an offline place, then added it to my website. Now that I'm interested in adding changes in as table build environment, I am very confused at the way I coded this game.

I'm taking the time now to try and outline the Angular flow I used.

App is the root document, in terms of HTML and TS.

The structure is:
                                APP
                                 |
                         ------------------
                         |       |        |
                       Menu    Game     Instructions
                                 |
                         ------------------
                         |       |        |
                       Header  Board     Footer
                                 |
                                 |
                              Quadrant
                                 |
                                 |
                              Square

There is also a ComputerService that is meant to govern the AI logic of playing against a computer.

As of now, the main game logic is handled in the Board class (which I think should be handled in the Game class).

In terms of variables, communication is done between components using JSON.
The primary JSON variables are:
-sid (Square ID)
-qid (Quadrant ID)
-pid (Player ID)

There is a high-level variable to track whose turn it is.

## 2022/08/03
The rules have been updated now. I have added my own images to the game now (as opposed to using ones hosted on Wikipedia).

I've uploaded version 1.0 of this game to Stackblitz. I would upload this version but they don't allow free accounts to use their own images.

Stackblitz link: https://stackblitz.com/edit/angular-ivy-ezg9qu

## 2022/07/29
This is a project I made in July 2022. It took me a bit over a week to get it working.

Instructions on how to play the game can be found in the game itself.

I will be making refinements to this application; I'm going to update the rules and add some images to use instead of changing element background colours. The original copy (the 1.0 if you will) can be found in the branch "ettt-1.0".

# Helpful Google Boiler About Angular

This project was generated with [Angular CLI](https://github.com/angular/angular-cli) version 14.1.0.

## Development server

Run `ng serve` for a dev server. Navigate to `http://localhost:4200/`. The application will automatically reload if you change any of the source files.

## Code scaffolding

Run `ng generate component component-name` to generate a new component. You can also use `ng generate directive|pipe|service|class|guard|interface|enum|module`.

## Build

Run `ng build` to build the project. The build artifacts will be stored in the `dist/` directory.

## Running unit tests

Run `ng test` to execute the unit tests via [Karma](https://karma-runner.github.io).

## Running end-to-end tests

Run `ng e2e` to execute the end-to-end tests via a platform of your choice. To use this command, you need to first add a package that implements end-to-end testing capabilities.

## Further help

To get more help on the Angular CLI use `ng help` or go check out the [Angular CLI Overview and Command Reference](https://angular.io/cli) page.
