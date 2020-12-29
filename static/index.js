console.log("Javascript is Working");
document.onkeydown = (event) => {
    if (event.key == " ") {
        document.onkeydown = null;
        start();
    } else if (event.key == "v") {
        console.log("Loading View Database");
        let form = document.createElement("form");
        document.body.appendChild(form);
        form.action = "/view";
        form.method = "get";
        form.submit();
    }
};

class ReactionTimer {
    constructor(exit) {
        this.pi = (Math.floor(Math.random() * 301) + 100) * 10;
        this.timeElapsed = 0;
        this.exit = exit;
    }
    startDelayTimer(callback) {
        document.onkeydown = (event) => {
            if (event.key == " ") {
                console.log("Too Early");
                this.exit(0);
            }
        };
        this.callback = callback;
        this.timer = setInterval(this.calculateDelayTime.bind(this), 10);
    }
    calculateDelayTime() {
        this.timeElapsed += 10;
        if (this.timeElapsed >= this.pi) {
            clearInterval(this.timer);
            this.timeElapsed = 0;
            this.startTime = new Date();
            document.querySelector(".rectangle").style.backgroundColor =
                "green";
            document.onkeydown = (event) => {
                if (event.key == " ") {
                    let end = new Date();
                    document.onkeydown = null;
                    this.timeElapsed = end - this.startTime;
                    this.callback(this.timeElapsed, this.pi);
                }
            };
        }
    }
}

function start() {
    startButton = document.querySelector(".startButton");
    startButton.style.visibility = "hidden";
    let timer = new ReactionTimer(exit);
    timer.startDelayTimer(end);
}

function end(rt, pi) {
    document.onkeydown = (event) => {
        if (event.key == " ") {
            exit(rt, pi);
            console.log("Recorded");
        } else if (event.key == "d") {
            exit(0, 0);
            console.log("Discard");
        }
    };
    let results = "You Reacted in: " + rt + " ms!";
    document.querySelector("h1").innerHTML = results;
    document.querySelector("h2").innerHTML = "Spacebar: Record | d: Discard";
}

function exit(rt, pi) {
    if (rt == 0) {
        let form = document.createElement("form");
        document.body.appendChild(form);
        form.action = "/";
        form.method = "post";
        form.submit();
    } else {
        let form = document.createElement("form");
        document.body.appendChild(form);
        form.action = "/";
        form.method = "post";
        let rtTag = document.createElement("input");
        form.appendChild(rtTag);
        rtTag.name = "rt";
        rtTag.type = "hidden";
        rtTag.value = rt;
        let piTag = document.createElement("input");
        form.appendChild(piTag);
        piTag.name = "pi";
        piTag.type = "hidden";
        piTag.value = pi;
        form.submit();
    }
}
