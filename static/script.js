const predictForm = document.getElementById('predict-form');
const inputSMS = document.getElementById('input-sms');
const inputLink = document.getElementById('input-lin');
const resultLinElement = document.getElementById('liSafe');
const resultElement = document.getElementById('result');

predictForm.addEventListener('submit', async (event) => {

    function calculateFKGL(text) {
        // Tokenize the text into words and sentences
        console.log(text)
        const words = text.trim().split(/\s+/);
        const sentences = text.trim().split(/[.?!]/).filter(Boolean);
      
        // Calculate word count, sentence count, and syllable count
        const wordCount = words.length;
        const sentenceCount = sentences.length;
        let syllableCount = 0;
      
        words.forEach(word => {
          syllableCount += countSyllables(word);
        });
      
        // Calculate the FKGL *Flesch-Kincaid Grade Level*
        const averageWordsPerSentence = wordCount / sentenceCount;
        const averageSyllablesPerWord = syllableCount / wordCount;
        const fkgl = 206.835 - (1.015 * averageWordsPerSentence) - (84.6 * averageSyllablesPerWord);
      
        return fkgl.toFixed(2);
      }
      
      function countSyllables(word) {
        // Simple syllable counting logic
        word = word.toLowerCase();
        if (word.length <= 3) {
          return 1;
        }
        word = word.replace(/(?:[^laeiouy]es|ed|[^laeiouy]e)$/, '');
        word = word.replace(/^y/, '');
        const syllableMatches = word.match(/[aeiouy]{1,2}/g);
        return syllableMatches ? syllableMatches.length : 0;
      }
      
      // Example usage
      const text = inputSMS.value;
      const fkgl = calculateFKGL(text);
      const gramCh = (fkgl < 80)
      console.log(fkgl)
    
    ////////////////
    event.preventDefault();
    console.log('Form submitted');
    
    try {
        if(gramCh){
            throw new Exception();
        }

        const response = await fetch('http://127.0.0.1:5000/predict', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json'
            },
            body: JSON.stringify({ input_sms: inputSMS.value })
        });

        console.log('Input SMS:', inputSMS.value);
        console.log('Response received:', response);
        if (!response.ok) {
            throw new Error(`HTTP error! status: ${response.status}`);
        }
        const data = await response.json();
        console.log('Data:', data);
        if (data.result === 1) {
            resultElement.textContent = 'This message is most likely a SCAM email!';
        } else {
            resultElement.textContent = 'This message does not seem like a scam email.';
        }

        
    } catch (error) {
        console.error('Error:', error);
        resultElement.textContent = 'Error: Could not get a result';
        
    }

    try{
        const isValidUrl = urlString=> {
            var urlPattern = new RegExp('^(https?:\\/\\/)?'+ // validate protocol
            '((([a-z\\d]([a-z\\d-]*[a-z\\d])*)\\.)+[a-z]{2,}|'+ // validate domain name
            '((\\d{1,3}\\.){3}\\d{1,3}))'+ // validate OR ip (v4) address
            '(\\:\\d+)?(\\/[-a-z\\d%_.~+]*)*'+ // validate port and path
            '(\\?[;&a-z\\d%_.~+=-]*)?'+ // validate query string
            '(\\#[-a-z\\d_]*)?$','i'); // validate fragment locator
            return !!urlPattern.test(urlString);
        }

        if(!isValidUrl(inputLink.value)){
            throw new Exception();
        }

        if(!inputLink.value.includes('https')){
            resultLinElement.textContent = 'This link is most likely a SCAM link!'
        } else{
            resultLinElement.textContent = 'This link does not seem like a scam link.'
        }

    } catch(error) {
        console.error('Error:', error);
        resultLinElement.textContent = 'Error: Not a valid URL';
    }

});