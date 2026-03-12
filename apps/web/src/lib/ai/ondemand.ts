// On-Demand.io AI Agent Integration

const ONDEMAND_API_URL = process.env.NEXT_PUBLIC_ONDEMAND_API_URL || 'https://api.on-demand.io/v1';
const ONDEMAND_API_KEY = process.env.NEXT_PUBLIC_ONDEMAND_API_KEY || '';

export interface AIAgentRequest {
    query: string;
    context?: {
        userIncome?: number;
        userLocation?: string;
        policyType?: string;
    };
}

export interface AIAgentResponse {
    answer: string;
    sources?: string[];
    confidence: number;
    relatedPolicies?: string[];
}

export async function queryAIAgent(request: AIAgentRequest): Promise<AIAgentResponse> {
    try {
        const response = await fetch(`${ONDEMAND_API_URL}/agents/query`, {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
                'Authorization': `Bearer ${ONDEMAND_API_KEY}`,
            },
            body: JSON.stringify({
                query: request.query,
                context: {
                    domain: 'indian-policy',
                    ...request.context,
                },
            }),
        });

        if (!response.ok) {
            throw new Error(`AI Agent request failed: ${response.statusText}`);
        }

        const data = await response.json();

        return {
            answer: data.answer || 'No response from AI agent',
            sources: data.sources || [],
            confidence: data.confidence || 0,
            relatedPolicies: data.relatedPolicies || [],
        };
    } catch (error) {
        console.error('AI Agent error:', error);
        throw new Error('Failed to get response from AI agent');
    }
}

export async function analyzePolicy(
    policyText: string,
    userProfile?: {
        income: number;
        location: string;
        occupation: string;
    }
): Promise<{
    summary: string;
    impact: string;
    recommendations: string[];
}> {
    const query = `Analyze this Indian policy and explain its impact${userProfile ? ` for someone earning ₹${userProfile.income} in ${userProfile.location} working as ${userProfile.occupation}` : ''
        }: ${policyText}`;

    const response = await queryAIAgent({ query, context: userProfile });

    return {
        summary: response.answer,
        impact: response.answer,
        recommendations: response.relatedPolicies || [],
    };
}
