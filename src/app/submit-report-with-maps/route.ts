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

    // Configure nodemailer with Gmail
    const transporter = nodemailer.createTransport({
      service: 'gmail',
      auth: {
        user: process.env.EMAIL_USER,
        pass: process.env.EMAIL_PASSWORD
      }
    });

    // Prepare email with photo
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
      cc: 'smartcity@report.gov.lk', // Your system email
      subject: `🚨 URGENT: Civic Issue Report - ${description.substring(0, 50)}...`,
      html: `
        <div style="font-family: Arial, sans-serif; max-width: 700px; margin: 0 auto; background: linear-gradient(135deg, #f3f4f6 0%, #e5e7eb 100%); padding: 20px; border-radius: 12px;">
          
          <div style="background: linear-gradient(135deg, #06b6d4 0%, #0891b2 100%); padding: 25px; color: white; border-radius: 12px; margin-bottom: 20px; box-shadow: 0 4px 6px rgba(0,0,0,0.1);">
            <h2 style="margin: 0 0 10px 0;">🏛️ SmartCity Automated Report System</h2>
            <p style="margin: 0; font-size: 14px; opacity: 0.9;">Urgent Civic Issue Notification</p>
          </div>

          <div style="background: white; padding: 25px; border-radius: 12px; margin-bottom: 20px; border-left: 5px solid #06b6d4;">
            <h3 style="color: #0891b2; margin-top: 0;">📋 TO: ${officialName}</h3>
            <p style="margin: 10px 0;"><strong>Office Location:</strong> ${officialAddress}</p>
            <p style="margin: 10px 0;"><strong>Contact:</strong> ${officialPhone}</p>
          </div>

          <div style="background: #fef3c7; padding: 20px; border-radius: 12px; margin-bottom: 20px; border-left: 5px solid #f59e0b;">
            <h3 style="margin-top: 0; color: #92400e;">⚠️ ISSUE ALERT</h3>
            ${emailContent ? `<p style="line-height: 1.8; color: #333; margin: 0;">${emailContent.replace(/\n/g, '<br>')}</p>` : ''}
          </div>

          <div style="background: white; padding: 20px; border-radius: 12px; margin-bottom: 20px; border: 1px solid #e5e7eb;">
            <h4 style="color: #06b6d4; margin-top: 0;">📍 Report Details</h4>
            <p style="margin: 8px 0;"><strong>Location:</strong> ${latitude}, ${longitude}</p>
            <p style="margin: 8px 0;"><strong>Description:</strong> ${description}</p>
            <a href="${mapsUrl}" style="color: #0891b2; text-decoration: none; font-weight: bold;">🗺️ View on Google Maps →</a>
          </div>

          <div style="background: #ecfdf5; padding: 20px; border-radius: 12px; border-left: 5px solid #10b981;">
            <p style="margin: 0; color: #047857;"><strong>✓ Status:</strong> Automatically routed to nearest Divisional Secretary</p>
            <p style="margin: 8px 0 0 0; font-size: 12px; color: #666;">System: SmartCity Reporter v1.0 | Generated: ${new Date().toLocaleString()}</p>
          </div>

        </div>
      `,
      attachments: attachments
    };

    // Send email
    await transporter.sendMail(mailOptions);

    // Log report (you can save to database)
    console.log('Report submitted:', {
      description,
      officialName,
      latitude,
      longitude,
      timestamp: new Date()
    });

    return NextResponse.json({
      success: true,
      message: 'Report submitted and email sent successfully',
      officialName: officialName
    });
  } catch (error) {
    console.error('Submit Report Error:', error);
    return NextResponse.json(
      { success: false, error: 'Failed to submit report' },
      { status: 500 }
    );
  }
}