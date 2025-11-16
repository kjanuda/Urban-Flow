import { GoogleGenerativeAI } from '@google/generative-ai';

const genAI = new GoogleGenerativeAI(process.env.GEMINI_API_KEY || '');

export async function POST(request: NextRequest) {
  try {
    const {
      issueDescription,
      officialName,
      officialAddress,
      city,
      reporterLocation,
      distance,
      phone,
      placeType,
      rating
    } = await request.json();

    const model = genAI.getGenerativeModel({ model: 'gemini-pro' });

    const prompt = `You are a professional government report writer in Sri Lanka. Generate a formal but friendly email to a Divisional Secretary about a reported civic issue.

Official Details:
- Name: ${officialName}
- Address: ${officialAddress}
- City: ${city}
- Phone: ${phone}
- Distance from reporter: ${distance} km

Issue Report:
- Description: ${issueDescription}
- Reporter Location: ${reporterLocation}

Generate a professional email with:
1. Proper salutation addressing the Divisional Secretary
2. Clear subject line about the issue
3. Detailed issue description with location specifics
4. Urgency level assessment
5. Request for immediate action
6. Reporter location coordinates
7. Professional closing

Keep it concise (under 250 words). Be formal, clear, and action-oriented. Include emoji where appropriate for visual appeal.`;

    const result = await model.generateContent(prompt);
    const emailContent = result.response.text();

    return NextResponse.json({
      success: true,
      emailContent
    });
  } catch (error) {
    console.error('Gemini Error:', error);
    return NextResponse.json(
      { success: false, error: 'Failed to generate email with Gemini' },
      { status: 500 }
    );
  }
}