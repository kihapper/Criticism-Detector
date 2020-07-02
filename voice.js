  window.SpeechRecognition = window.webkitSpeechRecognition || window.SpeechRecognition;

  let textTag = document.querySelector(".recognitionText");
  let initButton = document.getElementById("Button");

  initButton.addEventListener("click", startRecognition);

  let currentState = "stopped";

  let debug = false;
  document.addEventListener("keypress", function(event) {
    //for debugging output score result
    if (event.keyCode == 13) {
      debug = true;
      console.log(debug);
    }else{
      debug = false;
      console.log(debug);
    }
  });
  //———Feedback Emoji\
const angry = "😠"
const critical = "🤨"
const doubting = "🤔"
const neutral = "🙂"
const happy = "😊"

const emoji = ["😠","🤨","🤔","🙂","😊"]
  // ML5 —————————
  let prediction;
  let finalScore;
  console.log("ml5 version:" + ml5.version);
  const sentiment = ml5.sentiment('movieReviews', modelReady);

  // When the model is loaded
  function modelReady() {
    console.log("Machine Learning Model Loaded!");
  }

  // Bowser to detect browser——————————————

  let result = bowser.getParser(window.navigator.userAgent);
  console.log(result);
  console.log("Browser is " + result.parsedResult.browser.name);

  if (result.parsedResult.browser.name !== "Chrome") {
    alert("Sorry, voice recognition is only available on the latest version of Chrome desktop and is not supported on " + result.parsedResult.browser.name);
    //initButton.style.display = "none";
  } else {
    console.log("This Browser Supports Recognition");
  }

  // ———————————————————————————————————————————————



  //Initiates SpeechRecognition instance
  let recognition = new window.SpeechRecognition();
  let finalTranscript = '';

  //Show the results midway when recognizing
  recognition.interimResults = true;

  //Specify Language Here 
  recognition.lang = "en-GB"

  //Show how many alternatvies to return
  recognition.maxAlternatives = 10;

  //Will return sentences continously
  recognition.continuous = true;

  // linearly maps value from the range (a..b) to (c..d)
function mapRange (value, a, b, c, d) {
  // first map value from (a..b) to (0..1)
  value = (value - a) / (b - a);
  // then map it from (0..1) to (c..d) and return it
  return c + value * (d - c);
}

  function startRecognition() {

    if (currentState == "stopped") {
      initButton.innerHTML = "Pause Speech Recognition"
      currentState = "recognizing"
      recognition.start();
      initButton.classList.add("blink");
    } else if (currentState == "recognizing") {
      initButton.innerHTML = "Start Recognition"
      currentState = "stopped"
      initButton.classList.remove("blink");
      recognition.stop();
    }
  }


  recognition.onresult = (event) => {
    //Inialize interim transcripts
    let interimTranscript = '';
    let scoreArray = 0;

    //event returns the whole dataset. reuslt Index is the depth of each word
    for (let i = event.resultIndex, len = event.results.length; i < len; i++) {
      let transcript = event.results[i][0].transcript;
      if (event.results[i].isFinal) {

        //ml5.js to rate the final transcripts score
        prediction = sentiment.predict(transcript);
        console.log("IntermediateScore" + prediction.score);
        finalScore = Math.floor(prediction.score * 100);
        console.log(finalScore + " for : " + transcript);

        if(debug === true){finalScore = 15}

        scoreArray = mapRange(finalScore,0,100,0,4);
        scoreArray = Math.round(scoreArray);


        finalTranscript =  transcript + '<br>' + '<span class= "score">' + "Criticism Score: " + (100 - finalScore) + "/100" + "  " + emoji[scoreArray] + '</span>' + '<br><br>' + finalTranscript;
        textTag.innerHTML = '<span class= "finaltext">' + finalTranscript + '</span>';
      } else {
        interimTranscript = interimTranscript + transcript;
        textTag.innerHTML = '<span class= "loadingText">' + interimTranscript + "</span>" + '<br><br><br>' + '<span class= "finaltext">' + finalTranscript + '</span>';
      }
    }
    //midtextTag.innerHTML = interimTranscript;
  }

  recognition.onerror = (event) => {
    console.log('Speech recognition error detected: ' + event.error);
  }

  recognition.onspeechend = () => {
    console.log('Speech has stopped');
    recognition.stop();
    currentState = "stopped"

  }

  recognition.onend = () => {
    console.log('Speech recognition service disconnected');
    currentState = "stopped"
  }