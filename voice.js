  
  // ML5 —————————
  let prediction;
  let finalScore;
  console.log("ml5 version:" +  ml5.version);
  const sentiment = ml5.sentiment('movieReviews', modelReady);

  // When the model is loaded
  function modelReady() {
  console.log("Machine Learning Model Loaded!");
  }

  // ——————————————

    window.SpeechRecognition = window.webkitSpeechRecognition || window.SpeechRecognition;
    
    let midtextTag = document.querySelector(".midwayText");
    let textTag = document.querySelector(".recognitionText");

    var initButton = document.getElementById("Button");
    initButton.addEventListener("click", startRecognition);

    var currentState = "stopped";


    if ('SpeechRecognition' in window) {
        console.log("This Browser Supports Recognition");
      } else {
        alert("Not Supported");
      }

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

    function startRecognition() {
      
      if(currentState == "stopped"){
      initButton.innerHTML = "Pause Recognition"
      currentState = "recognizing"
      recognition.start();
      }
      else if (currentState == "recognizing"){
      initButton.innerHTML = "Start Recognition"
      currentState = "stopped"
      recognition.stop();
      }
    }


    recognition.onresult = (event) => {
      //Inialize interim transcripts
      let interimTranscript = '';

      //event returns the whole dataset. reuslt Index is the depth of each word
      for (let i = event.resultIndex, len = event.results.length; i < len; i++) {
        let transcript = event.results[i][0].transcript;
        if (event.results[i].isFinal) {

          //ml5.js to rate the final transcripts score
          prediction = sentiment.predict(transcript);
          console.log("IntermediateScore" + prediction.score);
          finalScore = Math.floor(prediction.score*100);
          console.log(finalScore + " for : " + transcript);

          finalTranscript =  transcript + '<br>' + finalScore + "/100" + '<br><br>' + finalTranscript ;
        } else {
          interimTranscript = interimTranscript + transcript;
        }
      }
      midtextTag.innerHTML = interimTranscript;
      textTag.innerHTML =  '<span class= "finaltext">' + finalTranscript + '</span>';
    }
    
    recognition.onerror = (event) => {
        console.log('Speech recognition error detected: ' + event.error);
      }
    
    recognition.onspeechend = ()=> {
      console.log('Speech has stopped');
      recognition.stop();
    }

    
    recognition.onend = ()=> {
        console.log('Speech recognition service disconnected');
        //recognition.start();
    }
      

  