import nodemailer from "nodemailer";

// 📩 Send Email Controller
export const sendEmail = async (req, res) => {
  const { name, email, message } = req.body;

  try {
    // Configure transporter
    const transporter = nodemailer.createTransport({
      service: "gmail",
      auth: {
        user: "manikandan110305@gmail.com",      // replace with your Gmail
        pass: "sfjn ubgs okwl dlvi",        // Gmail App Password
      },
    });

    // Mail options
    const mailOptions = {
      from: email,
      to: "manikandan110305@gmail.com", // your inbox
      subject: `Manjusha Shop Customer inquiry from ${name}`,
      text: `
        Name: ${name}
        Email: ${email}
        Message: ${message}
      `,
    };

    // Send mail
    await transporter.sendMail(mailOptions);

    res.status(200).json({ success: true, message: "Email sent successfully!" });
  } catch (error) {
    console.error("Email error:", error);
    res.status(500).json({ success: false, message: "Failed to send email." });
  }
};
