import { NextResponse } from 'next/server';
import fs from 'fs/promises';
import path from 'path';

export async function OPTIONS() {
    return new NextResponse(null, {
        status: 200,
        headers: {
            'Access-Control-Allow-Origin': '*',
            'Access-Control-Allow-Methods': 'GET, POST, PUT, DELETE, OPTIONS',
            'Access-Control-Allow-Headers': 'Content-Type, Authorization',
        },
    });
}

export async function POST(request: Request) {
    try {
        // Set CORS headers
        const headers = {
            'Access-Control-Allow-Origin': '*',
            'Access-Control-Allow-Methods': 'GET, POST, PUT, DELETE, OPTIONS',
            'Access-Control-Allow-Headers': 'Content-Type, Authorization',
        };

        const data = await request.json();
        
        // Read the current db.json
        const dbPath = 'C:/Users/va648/Downloads/VSCode/chex/frontend/public/db.json'
        const currentData = JSON.parse(await fs.readFile(dbPath, 'utf8'));

        // Update the check_in data
        currentData.check_in = {
            transcript: data.transcript,
            has_occurred: data.has_occurred,
            appointment_recommended: data.appointment_recommended
        };

        // Write back to db.json
        await fs.writeFile(dbPath, JSON.stringify(currentData, null, 2));

        return NextResponse.json({ success: true }, { headers });
    } catch (error) {
        console.error('Error updating check-in data:', error);
        return NextResponse.json(
            { error: 'Failed to update check-in data' },
            { 
                status: 500,
                headers: {
                    'Access-Control-Allow-Origin': '*',
                    'Access-Control-Allow-Methods': 'GET, POST, PUT, DELETE, OPTIONS',
                    'Access-Control-Allow-Headers': 'Content-Type, Authorization',
                }
            }
        );
    }
} 