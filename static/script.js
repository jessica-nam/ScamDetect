const predictForm = document.getElementById('predict-form');
const inputSMS = document.getElementById('input-sms');
const inputLink = document.getElementById('input-lin');
const resultLinElement = document.getElementById('liSafe');
const resultElement = document.getElementById('result');
const teli = document.getElementById('liTe');


predictForm.addEventListener('submit', async (event) => {
    event.preventDefault();
    console.log('Form submitted');
    
    try {
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