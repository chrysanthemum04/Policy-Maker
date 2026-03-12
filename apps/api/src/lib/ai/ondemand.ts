/**
 * On-Demand.io AI Integration
 * Simplified wrapper for AI API calls
 */

interface AIQueryRequest {
    systemPrompt: string;
    userPrompt: string;
    constraints?: string[];
}

export class OnDemandAI {
    // Hardcoded for emergency fix as per user request
    private apiKey = process.env.ONDEMAND_API_KEY || '';
    private readonly BASE_URL = "https://api.on-demand.io/chat/v1";
    private readonly ENDPOINT_ID = "predefined-openai-gpt4.1-nano";

    constructor() {
        // No-op
    }

    async query(request: AIQueryRequest, externalUserId: string = 'default-user'): Promise<any> {
        try {
            // Combine prompts into a single query
            // Simplification: Just send the user prompt if system prompt is causing issues, 
            // but let's try combining first.
            const combinedQuery = `${request.systemPrompt}\n\nUser Query: ${request.userPrompt}`;

            const url = `${this.BASE_URL}/sessions/query`;

            const body = {
                query: combinedQuery,
                endpointId: this.ENDPOINT_ID,
                responseMode: "sync"
            };

            console.log('--- OnDemand API Request ---');
            console.log('URL:', url);
            console.log('Endpoint:', this.ENDPOINT_ID);
            console.log('Query Length:', combinedQuery.length);

            const response = await fetch(url, {
                method: 'POST',
                headers: {
                    'apikey': this.apiKey,
                    'Content-Type': 'application/json'
                },
                body: JSON.stringify(body)
            });

            if (!response.ok) {
                const errorText = await response.text();
                console.error(`❌ OnDemand API Error: ${response.status}`);
                console.error('Error Body:', errorText);
                throw new Error(`Failed to query AI: ${response.status} - ${errorText}`);
            }

            const data: any = await response.json();
            console.log('✅ OnDemand API Success');
            console.log('Response Keys:', Object.keys(data));
            if (data.data) console.log('Data Keys:', Object.keys(data.data));

            // Extract answer from response
            const answer = data.data?.answer || data.answer || JSON.stringify(data);
            return answer;

        } catch (error) {
            console.error('💥 OnDemand AI Exception:', error);
            throw error;
        }
    }
}
