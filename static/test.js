(function() {


    let piTimeElapsed, piTimer, pi;
    let start_button = document.querySelector("#test_page_start_button");
    init();


    function init() {

        function startTestEventHandler(e) {
            start_button.removeEventListener("click", startTestEventHandler);
            startTest();
        }

        start_button.addEventListener("click", startTestEventHandler);
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

            start_button.addEventListener("click", pressEventHandler);
        }
    }


    function endTest(rt, pi) {

        function startTestEventHandler(e) {
            start_button.removeEventListener("click", startTestEventHandler);
            startTest();
        }

        start_button.addEventListener("click", startTestEventHandler);

        let results = "You Reacted in: " + rt + " ms!";
        document.querySelector("#test_page_results_text").innerHTML = results;
        document.querySelector("#test_page_results_wrapper").style.display = "flex"

        start_button.style.backgroundColor = "red"
        start_button.innerHTML = "START"

        document.querySelector("#test_page_results_submit_button").onclick = () => {submitResults(rt, pi)}

    }


    function submitResults(rt, pi) {
        let form = document.querySelector("#submitResultsForm");
        let rtTag = document.querySelector("#rtTag");
        rtTag.value = rt;
        let piTag = document.querySelector("#piTag");
        piTag.value = pi;
        form.submit();
    }


})()