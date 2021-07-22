from boggle import Boggle
from flask import Flask, request, render_template, session, jsonify

app = Flask(__name__)
app.config["SECRET_KEY"] = 'aljhas'

boggle_game = Boggle()


@app.route("/")
def home():
    """makes the board"""
    #generating a board on the backend using a function from the boggle.py 
    #file and sending that to your Jinja template.
    board = boggle_game.make_board()
    session['board'] = board
    highscore = session.get("highscore", 0)
    turns = session.get("turns", 0)

    return render_template("index.html", board=board, 
                            highscore=highscore, turns=turns)
#On the server, take the form value and check if it is a valid word 
#in the dictionary using the words variable in your app.py.
@app.route("/check-for-word")
def check_for_word():
    """Check words.txt for word"""
    #get user word, assign it
    word = request.args["word"]
    #assign this session board
    board = session["board"]
    #search current session board for user word assign to 'res'
    res = boggle_game.check_valid_word(board, word)
    #return Jsonify using @check_valid_word inside boggle.py
    return jsonify({'result': res})

@app.route("/score", methods=["POST"])
def score():
    """Get score, update turns, update high score if appropriate."""
    #get score
    score = request.json["score"]
    #get highscore if it exists otherwise default to 0
    highscore = session.get("highscore", 0)
    #get turns or default to 0
    turns = session.get("turns", 0)
    #increment turns
    session['turns'] = turns + 1
    #compare score to highscore, return higher
    session['highscore'] = max(score, highscore)

    return jsonify(brokeRecord=score > highscore)