# Reversy
# Main file is Reversy.html - all JS code is in app.js

Summary:
Reversy is a board game, rules may be found here: http://www.flyordie.com/games/help/reversi/en/games_rules_reversi.html
We implemeneted this web application using Vanilla Javascript.

Architecture:
We followed the MVC pattern.
hence, we have 3 modules:
1. model (named logic in our code)
percieve the entire logic of the game, regardless to what UI the game will be renderd on.

2. view (named UI in our code)
displaying the game to the user.

3. controler
the controloer model is in charge of connecting the UI to the model.
in this module, we catch all the events that are triggered upon input the user wanted to make.
the controler pass this input to the model, which decides what to do regarding it => and then calling the UI to render the updates.


