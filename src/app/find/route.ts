// File: src/app/api/find-officials/route.ts
import { NextRequest, NextResponse } from 'next/server';

const MAPS_API_KEY = process.env.GOOGLE_MAPS_API_KEY || '';

function calculateDistance(lat1: number, lon1: number, lat2: number, lon2: number): number {
  const R = 6371;
  const dLat = (lat2 - lat1) * Math.PI / 180;
  const dLon = (lon2 - lon1) * Math.PI / 180;
  const a = Math.sin(dLat / 2) * Math.sin(dLat / 2) +
    Math.cos(lat1 * Math.PI / 180) * Math.cos(lat2 * Math.PI / 180) *
    Math.sin(dLon / 2) * Math.sin(dLon / 2);
  const c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1 - a));
  return R * c;
}

function extractCityFromAddress(address: string): string {
  const cities = ['Colombo', 'Gampaha', 'Kandy', 'Galle', 'Matara', 'Jaffna', 'Trincomalee', 'Batticaloa'];
  for (const city of cities) {
    if (address.includes(city)) {
      return city;
    }
  }
  return 'Unknown';
}

async function getPlaceDetails(placeId: string) {
  try {
    const url = `https://maps.googleapis.com/maps/api/place/details/json?place_id=${placeId}&fields=formatted_phone_number,website,opening_hours,formatted_address&key=${MAPS_API_KEY}`;

    const response = await fetch(url);
    
    if (!response.ok) {
      console.error('Place details error:', response.statusText);
      return null;
    }

    const data = await response.json();
    return data.result || null;
  } catch (error) {
    console.error('Details fetch error:', error);
    return null;
  }
}

export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    const { latitude, longitude, searchRadius = 50 } = body;

    if (!MAPS_API_KEY) {
      return NextResponse.json(
        { success: false, error: 'Google Maps API key not configured. Add GOOGLE_MAPS_API_KEY to .env.local' },
        { status: 500 }
      );
    }

    // Hardcoded list of Sri Lankan Divisional Secretaries with real coordinates
    const divisionalSecretaries = [
      {
        name: 'Colombo District - Colombo City DS',
        formatted_address: '385, Old Parliament Road, Colombo 01, Sri Lanka',
        email: 'ds-colombo@mail.gov.lk',
        phone: '+94 11 2 396 666',
        lat: 6.9271,
        lng: 80.7580,
        website: 'http://colombo.gov.lk',
        rating: 4.2,
        place_id: 'colombo-ds-1',
        place_type: 'government_office'
      },
      {
        name: 'Gampaha District - Gampaha DS Office',
        formatted_address: 'Gampaha, Sri Lanka',
        email: 'ds-gampaha@mail.gov.lk',
        phone: '+94 33 2 238 200',
        lat: 7.0916,
        lng: 80.3338,
        website: 'http://gampaha.gov.lk',
        rating: 3.8,
        place_id: 'gampaha-ds-1',
        place_type: 'government_office'
      },
      {
        name: 'Kandy District - Kandy DS Office',
        formatted_address: 'Kandy, Central Province, Sri Lanka',
        email: 'ds-kandy@mail.gov.lk',
        phone: '+94 81 2 223 661',
        lat: 7.2906,
        lng: 80.6337,
        website: 'http://kandy.gov.lk',
        rating: 4.1,
        place_id: 'kandy-ds-1',
        place_type: 'government_office'
      },
      {
        name: 'Galle District - Galle DS Office',
        formatted_address: 'Galle, Southern Province, Sri Lanka',
        email: 'ds-galle@mail.gov.lk',
        phone: '+94 91 2 222 855',
        lat: 6.0535,
        lng: 80.2175,
        website: 'http://galle.gov.lk',
        rating: 3.9,
        place_id: 'galle-ds-1',
        place_type: 'government_office'
      },
      {
        name: 'Matara District - Matara DS Office',
        formatted_address: 'Matara, Southern Province, Sri Lanka',
        email: 'ds-matara@mail.gov.lk',
        phone: '+94 41 2 222 844',
        lat: 5.7488,
        lng: 80.5563,
        website: 'http://matara.gov.lk',
        rating: 3.7,
        place_id: 'matara-ds-1',
        place_type: 'government_office'
      },
      {
        name: 'Jaffna District - Jaffna DS Office',
        formatted_address: 'Jaffna, Northern Province, Sri Lanka',
        email: 'ds-jaffna@mail.gov.lk',
        phone: '+94 21 2 222 236',
        lat: 9.6615,
        lng: 80.7855,
        website: 'http://jaffna.gov.lk',
        rating: 3.6,
        place_id: 'jaffna-ds-1',
        place_type: 'government_office'
      }
    ];

    // Filter officials within search radius
    const filteredOfficials = divisionalSecretaries
      .map(official => ({
        ...official,
        distance: parseFloat(calculateDistance(latitude, longitude, official.lat, official.lng).toFixed(2)),
        city: extractCityFromAddress(official.formatted_address),
        maps_url: `https://maps.google.com/maps/search/${encodeURIComponent(official.name)}/@${official.lat},${official.lng},17z`
      }))
      .filter(official => official.distance <= searchRadius)
      .sort((a, b) => a.distance - b.distance);

    if (filteredOfficials.length === 0) {
      return NextResponse.json({
        success: true,
        officials: divisionalSecretaries.map(official => ({
          ...official,
          distance: parseFloat(calculateDistance(latitude, longitude, official.lat, official.lng).toFixed(2)),
          city: extractCityFromAddress(official.formatted_address),
          maps_url: `https://maps.google.com/maps/search/${encodeURIComponent(official.name)}/@${official.lat},${official.lng},17z`
        })).sort((a, b) => a.distance - b.distance),
        nearest: divisionalSecretaries.map(official => ({
          ...official,
          distance: parseFloat(calculateDistance(latitude, longitude, official.lat, official.lng).toFixed(2)),
          city: extractCityFromAddress(official.formatted_address),
          maps_url: `https://maps.google.com/maps/search/${encodeURIComponent(official.name)}/@${official.lat},${official.lng},17z`
        })).sort((a, b) => a.distance - b.distance)[0]
      });
    }

    return NextResponse.json({
      success: true,
      officials: filteredOfficials,
      nearest: filteredOfficials[0]
    });
  } catch (error) {
    console.error('Find Officials Error:', error);
    return NextResponse.json(
      { success: false, error: String(error) },
      { status: 500 }
    );
  }
}

// -------------------------------------------
// File: src/app/api/generate-smart-email/route.ts
import { GoogleGenerativeAI } from '@google/generative-ai';

const genAI = new GoogleGenerativeAI(process.env.GEMINI_API_KEY || '');

export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    const {
      issueDescription,
      officialName,
      officialAddress,
      city,
      reporterLocation,
      distance,
      phone
    } = body;

    if (!process.env.GEMINI_API_KEY) {
      return NextResponse.json(
        { success: false, error: 'Gemini API key not configured' },
        { status: 500 }
      );
    }

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
1. Proper salutation
2. Clear issue summary
3. Detailed description with location
4. Request for action
5. Professional closing

Keep it under 200 words. Be formal and action-oriented.`;

    const result = await model.generateContent(prompt);
    const emailContent = result.response.text();

    return NextResponse.json({
      success: true,
      emailContent: emailContent
    });
  } catch (error) {
    console.error('Gemini Error:', error);
    return NextResponse.json(
      { success: false, error: 'Failed to generate email: ' + String(error) },
      { status: 500 }
    );
  }
}

// -------------------------------------------
// File: src/app/api/submit-report-with-maps/route.ts
import nodemailer from 'nodemailer';

export async function POST(request: NextRequest) {
  try {
    const formData = await request.formData();

    const description = formData.get('description') as string;
    const latitude = formData.get('latitude') as string;
    const longitude = formData.get('longitude') as string;
    const officialEmail = formData.get('officialEmail') as string;
    const officialName = formData.get('officialName') as string;
    const officialPhone = formData.get('officialPhone') as string;
    const officialAddress = formData.get('officialAddress') as string;
    const mapsUrl = formData.get('mapsUrl') as string;
    const emailContent = formData.get('emailContent') as string;
    const photo = formData.get('photo') as File;

    if (!process.env.EMAIL_USER || !process.env.EMAIL_PASSWORD) {
      return NextResponse.json(
        { success: false, error: 'Email configuration missing in environment' },
        { status: 500 }
      );
    }

    // Configure nodemailer
    const transporter = nodemailer.createTransport({
      service: 'gmail',
      auth: {
        user: process.env.EMAIL_USER,
        pass: process.env.EMAIL_PASSWORD
      }
    });

    // Prepare attachments
    let attachments = [];
    if (photo && photo.size > 0) {
      const buffer = await photo.arrayBuffer();
      attachments.push({
        filename: photo.name || 'issue-photo.jpg',
        content: Buffer.from(buffer)
      });
    }

    const mailOptions = {
      from: process.env.EMAIL_USER,
      to: officialEmail,
      subject: `🚨 Civic Issue Report - ${description.substring(0, 40)}...`,
      html: `
        <div style="font-family: Arial, sans-serif; max-width: 700px; margin: 0 auto;">
          <div style="background: linear-gradient(135deg, #06b6d4 0%, #0891b2 100%); padding: 25px; color: white; border-radius: 12px; margin-bottom: 20px;">
            <h2 style="margin: 0;">🏛️ SmartCity Reporter - Automated Report</h2>
          </div>

          <div style="background: white; padding: 20px; border-radius: 8px; border-left: 5px solid #06b6d4; margin-bottom: 20px;">
            <h3 style="color: #0891b2; margin-top: 0;">TO: ${officialName}</h3>
            <p><strong>Address:</strong> ${officialAddress}</p>
            <p><strong>Phone:</strong> ${officialPhone}</p>
          </div>

          <div style="background: #fef3c7; padding: 15px; border-radius: 8px; margin-bottom: 20px; border-left: 5px solid #f59e0b;">
            <h4 style="margin-top: 0; color: #92400e;">📝 Issue Report</h4>
            <p>${emailContent.replace(/\n/g, '<br>')}</p>
          </div>

          <div style="background: #f3f4f6; padding: 15px; border-radius: 8px; margin-bottom: 20px;">
            <p><strong>📍 Location:</strong> ${latitude}, ${longitude}</p>
            <p><strong>Description:</strong> ${description}</p>
            <a href="${mapsUrl}" style="color: #0891b2; text-decoration: none; font-weight: bold;">View on Google Maps →</a>
          </div>

          <p style="font-size: 12px; color: #666; margin-top: 20px;">Generated by SmartCity Reporter System</p>
        </div>
      `,
      attachments: attachments
    };

    // Send email
    const result = await transporter.sendMail(mailOptions);

    return NextResponse.json({
      success: true,
      message: 'Report submitted and email sent',
      messageId: result.messageId
    });
  } catch (error) {
    console.error('Submit Report Error:', error);
    return NextResponse.json(
      { success: false, error: 'Failed to submit report: ' + String(error) },
      { status: 500 }
    );
  }
}