(function() {


    let piTimeElapsed, piTimer, pi;
    let start_button = document.querySelector("#test_page_start_button");
    init();


    function init() {

        function startTestEventHandler(e) {
            document.removeEventListener("click", startTestEventHandler);
            startTest();
        }

        document.addEventListener("click", startTestEventHandler);
    }


    function startTest() {

        document.querySelector("#test_page_start_button").innerHTML = "";

        function earlyPressEventHandler(e) {
            start_button.removeEventListener("click", earlyPressEventHandler);
            document.querySelector("#resetTestForm").submit();
        }

        start_button.addEventListener("click", earlyPressEventHandler);

        piTimeElapsed = 0;
        pi = (Math.floor(Math.random() * 301) + 100) * 10;
        piTimer = setInterval(() => calculatePiTime(earlyPressEventHandler), 10);
    }


    function calculatePiTime(earlyPressEventHandler) {

        piTimeElapsed += 10;

        if (piTimeElapsed >= pi) {
            clearInterval(piTimer);
            start_button.removeEventListener("click", earlyPressEventHandler)
            piTimeElapsed = 0;

            let startTime = new Date();
            document.querySelector("#test_page_start_button").style.backgroundColor = "green";

            function pressEventHandler(e) {
                start_button.removeEventListener("click", pressEventHandler)

                let end = new Date();
                let rt = end - startTime;
                endTest(rt, pi);
            }

            document.addEventListener("click", pressEventHandler);
        }
    }


    function endTest(rt, pi) {

        function resultsEventHandler(e) {

            if (e.key == " ") {

                if (logged_in) {
                    document.removeEventListener("keydown", resultsEventHandler)
                    
                    // Insert values and submit form
                    let form = document.querySelector("#submitResultsForm");
                    let rtTag = document.querySelector("#rtTag");
                    rtTag.value = rt;
                    let piTag = document.querySelector("#piTag");
                    piTag.value = pi;
                    form.submit();
                }
                else {
                    document.removeEventListener("keydown", resultsEventHandler)

                    document.querySelector("#loginForm").submit();
                }

            }
            
            else if (e.key == "d") {
                document.removeEventListener("keydown", resultsEventHandler)

                document.querySelector("#resetTestForm").submit();
            }

        }

        document.addEventListener("keydown", resultsEventHandler)

        let results = "You Reacted in: " + rt + " ms!";
        document.querySelector("#test_page_results_text").innerHTML = results;
        document.querySelector("#test_page_results_wrapper").style.display = "flex"

        document.querySelector("#test_page_start_button").style.backgroundColor = "red"
        document.querySelector("#test_page_start_button").innerHTML = "START"

        /*
        document.onkeydown = (e) => {
            if (e.key == " ") {
                document.onkeydown = null;
                startTest();
            }
        }
        */
    }


})()