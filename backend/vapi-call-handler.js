// Import required dependencies
import fs from 'fs/promises';
import path from 'path';

// Your Vapi private key (get this from dashboard.vapi.ai)
const VAPI_PRIVATE_KEY = '183f4df8-2934-4f53-809c-01c8dc655573';

// Function to update the check-in data via API
async function updateCheckInData(transcript) {
    try {
        // Check if the transcript contains keywords for appointment recommendation
        const transcriptText = JSON.stringify(transcript).toLowerCase();
        const needsAppointment = transcriptText.includes('meeting') || transcriptText.includes('schedule');

        // Prepare the update data
        const updateData = {
            transcript: transcript,
            has_occurred: true,
            appointment_recommended: needsAppointment
        };

        // Send update to the API endpoint
        const response = await fetch('http://localhost:3001/api/update-check-in', {
            method: 'POST',
            mode: 'cors',
            headers: {
                'Content-Type': 'application/json'
            },
            body: JSON.stringify(updateData)
        });

        if (!response.ok) {
            throw new Error('Failed to update check-in data');
        }

        console.log('Successfully updated check-in data');
        console.log('Appointment recommended:', needsAppointment);
    } catch (err) {
        console.error('Error updating check-in data:', err);
    }
}

// Function to make an outbound call using Vapi's REST API
async function makeOutboundCall() {
    console.log('Initiating outbound call...');
    
    try {
        const response = await fetch('https://api.vapi.ai/call/phone', {
            method: 'POST',
            headers: {
                'Authorization': `Bearer ${VAPI_PRIVATE_KEY}`,
                'Content-Type': 'application/json'
            },
            body: JSON.stringify({
                assistantId: "bfdd90e8-35b6-44a0-ade1-2b68bd274cd6",
                customer: {
                    number: "+14698805468"
                },
                phoneNumberId: "e62bed30-62ed-4989-8801-028ab88afe95"
            })
        });

        if (!response.ok) {
            const errorData = await response.text();
            throw new Error(`Failed to initiate call: ${errorData}`);
        }

        const callData = await response.json();
        console.log('Call initiated successfully:', callData);

        // Set up polling to check call status and get transcript
        const callId = callData.id;
        console.log('Starting to poll call status for ID:', callId);
        
        const pollInterval = setInterval(async () => {
            try {
                console.log('Checking call status...');
                const statusResponse = await fetch(`https://api.vapi.ai/call/${callId}`, {
                    headers: {
                        'Authorization': `Bearer ${VAPI_PRIVATE_KEY}`
                    }
                });

                if (!statusResponse.ok) {
                    const errorData = await statusResponse.text();
                    console.error('Error checking call status:', errorData);
                    return;
                }

                const statusData = await statusResponse.json();
                console.log('Current call status:', statusData.status);
                console.log('Full status data:', JSON.stringify(statusData, null, 2));

                if (statusData.status === 'failed') {
                    console.error('Call failed:', statusData.error || 'No error details provided');
                    clearInterval(pollInterval);
                } else if (statusData.status === 'ended') {
                    console.log('Call ended successfully');
                    if (statusData.artifact?.messages) {
                        await updateCheckInData(statusData.artifact.messages);
                    }
                    clearInterval(pollInterval);
                }
            } catch (error) {
                console.error('Error during status check:', error);
            }
        }, 5000); // Poll every 5 seconds

        return callData;

    } catch (error) {
        console.error('Error making outbound call:', error);
        throw error;
    }
}

// Function to wait with countdown
function wait(seconds) {
    return new Promise(resolve => {
        let remainingSeconds = seconds;
        console.log(`\nStarting countdown: ${remainingSeconds} seconds until call...`);
        
        const interval = setInterval(() => {
            remainingSeconds--;
            if (remainingSeconds > 0) {
                console.log(`${remainingSeconds} seconds remaining...`);
            } else {
                clearInterval(interval);
                console.log('Starting call now!\n');
                resolve();
            }
        }, 1000);
    });
}

// Start with delay
console.log('Server started, waiting before making call...');
wait(60) // 60 seconds = 1 minute
    .then(() => makeOutboundCall())
    .then(call => console.log('Call setup completed:', call.id))
    .catch(error => console.error('Failed to setup call:', error)); 