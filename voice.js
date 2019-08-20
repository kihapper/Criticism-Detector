    
    window.SpeechRecognition = window.webkitSpeechRecognition || window.SpeechRecognition;
    
    var initButton = document.getElementById("Button");
    initButton.addEventListener("click", startRecognition);

    if ('SpeechRecognition' in window) {
        console.log("This Browser Supports Recognition");
      } else {
        alert("Not Supported");
      }

    //Initiates SpeechRecognition instance
    let textTag = document.querySelector(".recognitionText");
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
      recognition.start();

    }


    recognition.onresult = (event) => {
      //Inialize interim transcripts
      let interimTranscript = '';

      //event returns the whole dataset. reuslt Index is the depth of each word
      for (let i = event.resultIndex, len = event.results.length; i < len; i++) {
        let transcript = event.results[i][0].transcript;
        if (event.results[i].isFinal) {
          finalTranscript = finalTranscript + '<br>' + transcript;
        } else {
          interimTranscript += transcript;
        }
      }

      textTag.innerHTML = finalTranscript + '<br><i style="color:#ddd;">' + interimTranscript + '</>';
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
      

  