/*Now that you have a form built: when the user submits the form, 
send the guess to your server.
The page should not refresh when the user submits the form: 
this means you’ll have to make an HTTP request without refreshing 
the page—you can use AJAX to do that!
Make sure you include axios so that you can easily make AJAX requests.
Using jQuery, take the form value and using axios, 
make an AJAX request to send it to the server.
On the server, take the form value and check if it is a valid word in 
the dictionary using the words variable in your app.py.
Next, make sure that the word is valid on the board using the 
check_valid_word function from the boggle.py file.
Since you made an AJAX request to your server, you will need to 
respond with JSON using the jsonify function from Flask.
Send a JSON response which contains either a dictionary of 
{“result”: “ok”}, {“result”: “not-on-board”}, or
 {“result”: “not-a-word”}, so the front-end can provide 
 slightly different messages depending if the word is valid or not. */

class Game {
    //constructor using boardId
    constructor(boardId, seconds = 60) {
        this.seconds = seconds;
        this.score = 0;
        this.words = new Set();
        this.board = $(boardId);
        this.showTimer();
        //minus a second off the timer
        this.timer = setInterval(this.countdown.bind(this), 1000)
        $(".add-word", this.board).on("submit", this.handleSubmit.bind(this));
    }

    showWord(word) {
        $(".words", this.board).append($("<li>", { text: word }));
    }

    showScore() {
        $(".score", this.board).text(this.score);
    }

    showMessage(msg, cls) {
        $(".msg", this.board)
        .text(msg)
        .removeClass()
        .addClass(`msg ${cls}`);
    }

    /* Check that word submitted is unique and valid, if it is add Score and show the word*/

  async handleSubmit(event) {
    //prevent refresh
    event.preventDefault();
    const $word = $(".word", this.board);

    let word = $word.val();
    if (!word) return;
    //check for duplicate words
    if (this.words.has(word)) {
      this.showMessage(`${word} is a duplicate.`, "err");
      return;
    }

    // check for valid word on the server
    const response = await axios.get("/check-for-word", { params: { word: word }});
    if (response.data.result === "not-word") {
      this.showMessage(`${word} is not a valid word`, "err");
    } else if (response.data.result === "not-on-board") {
      this.showMessage(`${word} is not a valid word on this board`, "err");
    } else {
      this.showWord(word);
      this.score += word.length;
      this.showScore();
      this.words.add(word);
      this.showMessage(`Added: ${word}`, "ok");
    }

    $word.val("").focus();
  }

  /* Update timer in DOM */

  showTimer() {
    $(".timer", this.board).text(this.seconds);
  }

  /* countdown timer*/

  async countdown() {
    this.seconds -= 1;
    this.showTimer();

    if (this.seconds === 0) {
      clearInterval(this.timer);
      await this.scoreGame();
    }
  }

  /* end of game: score and update message. */

  async scoreGame() {
    $(".add-word", this.board).hide();
    const response = await axios.post("/score", { score: this.score });
    if (response.data.brokeRecord) {
      this.showMessage(`New record: ${this.score}`, "ok");
    } else {
      this.showMessage(`Final score: ${this.score}`, "ok");
    }
  }
}
