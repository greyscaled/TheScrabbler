#Requirements

This project's target audience is for people who cannot think of the proper move to make in this game; it will be a great benifit to people who wish to improve their vocabulary, this aplication will often give them sugestions that the user may not think of. This can also be used too see if a game is able to be won given a certain game state.

#Functional Requirements
for all.{sigma = {x1...x7} | max(scrabble_points(sigma*|sigma is an element of English Dictionary))}

1. The application will allow input game information:
  * Allowing the user to enter in the current game board
  * Allowing the user to enter in the current pieces one has in their current game state
2. The app shall have the following states:
  * Accepting input of existing letters
  * Waiting for a selection area on the grid
  * Prompting the user with a textbox that shall take as input the user's tiles
  * Displaying the result
3. The app shall abide by Scrabble rules, specifically:
  * Every sequence of adjacent letters forms a valid word
  * Scoring is the combined result of tile values and special board squares
4. Placing new letters will not replace any previous ones:
  * Selecting different word choices will not effect the current state of the grid

#Non Functional Requirements
1. The application shall be implemented within a website
 * The applcation shall be mainly written in javascript allowing for any eletronic device with a modern internet browser to access and use the applcation.  This includes Desktop, tablet, mobile, laptop etc.
 * The application shall use HTML for the main interface, using bootstrap to allow proper scaling for eletronic devices of different pixel densities and sizes.
2. The app shall consist of a 7x7 grid
  * This 7x7 grid is a small section of the actual board
  * The user will be able to click on cells of the grid using a touchscreen or mouse
  * The user will be able to enter values into the cells of the grid using a keyboard or touchscreen keypad
  * The user will be able to enter in which spaces will have special values such as double word scores.  This will be done by selecting a specific option from the screen.
3. The application will be able to reliably and effectively scan the grid  
  *The applcation will search through a dictionary http://introcs.cs.princeton.edu/java/data/ospd.txt, of official Scrabble words and find all words that can be formed by the inputed letters the user has entered. 
  * {The application will then look at the words with the highest scores seeing if they can be placed on the 7x7 grid, and will move through all the words} <== possibly remove
  *the scores of the possible words will be compared and the one with the highest score will be returned
 4. Sercuity will not be an issue because the applcation will not need any personal information
 
#Software Verifcation and Maintence
1. Verification will be preformed in the following steps
  *creating the basic user interface and ensuring using canoical sequences to ensure that every event will go to the proper state
  *module testing will be done using function tables to ensure the proper result, given a finite input
  *bottom up testing will be preformed testing smaller methods that do not use anything then testing the larger methodes which use these small applications
