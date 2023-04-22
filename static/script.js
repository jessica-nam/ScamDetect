const predictForm = document.getElementById('predict-form');
const inputSMS = document.getElementById('input-sms');
const resultElement = document.getElementById('result');

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

});
