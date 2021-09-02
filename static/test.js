(function() {

let timeElapsed, timer, pi;

document.onkeydown = (e) => {
    if (e.key == " ") {
        document.onkeydown = null;
        startTest();
    }
}


function startTest() {
    document.querySelector("#test_page_start_button").innerHTML = ""

    /* Create and start timer */
    timeElapsed = 0
    pi = (Math.floor(Math.random() * 301) + 100) * 10;

    document.onkeydown = (e) => {
        if (e.key == " ") {
            document.onkeydown = null;
            document.querySelector("#skipResultsForm").submit();
        }
    }

    timer = setInterval(calculateDelayTime, 10);
}

function calculateDelayTime() {
    timeElapsed += 10;
    if (timeElapsed >= pi) {
        clearInterval(timer);
        timeElapsed = 0;
        let startTime = new Date();
        document.querySelector("#test_page_start_button").style.backgroundColor = "green";
        document.onkeydown = (event) => {
            if (event.key == " ") {
                let end = new Date();
                document.onkeydown = null;
                let rt = end - startTime;
                endTest(rt, pi);
            }
        };
    }
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
    document.querySelector("#test_page_results_text").innerHTML = results;
    document.querySelector("#test_page_results_wrapper").style.display = "flex"

    document.querySelector("#test_page_start_button").style.backgroundColor = "red"
    document.querySelector("#test_page_start_button").innerHTML = "START"
    document.onkeydown = (e) => {
        if (e.key == " ") {
            document.onkeydown = null;
            startTest();
        }
    }
}


})()