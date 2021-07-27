document.onkeydown = (e) => {
    if (e.key == " ") {
        document.onkeydown = null;
        startTest();
    }
}

class ReactionTimer {
    constructor(endTest) {
        this.pi = (Math.floor(Math.random() * 301) + 100) * 10;
        this.timeElapsed = 0;
        this.endTest = endTest;
    }
    startDelayTimer() {
        document.onkeydown = (e) => {
            if (e.key == " ") {
                document.onkeydown = null;
                document.querySelector("#skipResultsForm").submit();
            }
        }
        this.timer = setInterval(this.calculateDelayTime.bind(this), 10);
    }
    calculateDelayTime() {
        this.timeElapsed += 10;
        if (this.timeElapsed >= this.pi) {
            clearInterval(this.timer);
            this.timeElapsed = 0;
            this.startTime = new Date();
            document.querySelector("#content").style.backgroundColor = "green";
            document.onkeydown = (event) => {
                if (event.key == " ") {
                    let end = new Date();
                    document.onkeydown = null;
                    let rt = end - this.startTime;
                    this.endTest(rt, this.pi);
                }
            };
        }
    }
}

function startTest() {
    homeText = document.querySelector(".homeText");
    homeText.style.display = "none";
    let timer = new ReactionTimer(endTest);
    timer.startDelayTimer();
}

function endTest(rt, pi) {
    document.onkeydown = (event) => {
        if (event.key == " ") {
            if (logged_in) {
                // Insert values and submit form
                let form = document.querySelector("#submitResultsForm");
                let rtTag = document.querySelector("#rtTag");
                rtTag.value = rt;
                let piTag = document.querySelector("#piTag");
                piTag.value = pi;
                form.submit();
            }
            else {
                document.querySelector("#loginForm").submit();
            }

        } else if (event.key == "d") {
            document.querySelector("#skipResultsForm").submit();
        }
    };
    let results = "You Reacted in: " + rt + " ms!";
    let resultsElement = document.querySelector("#results");
    let resultsTextElement = document.querySelector("#resultsText");
    resultsTextElement.innerHTML = results;
    resultsElement.style.display = "flex";
}
