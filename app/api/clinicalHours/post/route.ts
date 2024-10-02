import { supabase } from "@/lib/supabase";
import { NextRequest, NextResponse } from "next/server";
import { Resend } from "resend";

const resend = new Resend(process.env.NEXT_PUBLIC_RESEND_API_KEY); // Make sure the API key is in your environment variables

export const POST = async (req: NextRequest) => {
  try {
    // Directly parse the JSON body of the request
    const formData = await req.json();
    console.log("Received formData:", formData);

    // Insert the data into the Supabase table
    const { data: clinicalLog, error: insertError } = await supabase
      .from("clinical_Logs")
      .insert(formData)
      .select();

    if (insertError) {
      console.error("Supabase error:", insertError);
      throw insertError;
    }

    const { data: supervisor, error: supervisorError } = await supabase
      .from("user_profiles")
      .select("email, name")
      .eq("id", formData.supervisor_Id)
      .single();

    if (supervisorError) {
      console.error("Error fetching supervisor:", supervisorError);
      throw supervisorError;
    }

    const supervisorEmail = supervisor.email;
    const supervisorName = supervisor.name;

    console.log("Supervisor Email:", supervisorEmail);

    // Send an email to the supervisor using Resend
    const emailResponse = await resend.emails.send({
      from: " noreply@therapytrainings.com",
      to: supervisorEmail,
      subject: "New Clinical Log Submitted",
      html: `
        <p>Hello ${supervisorName},</p>
        <p>A new clinical log has been submitted by one of your supervisees.</p>
        <p>Week: ${formData.date_logged}</p>
        <p>Direct Hours: ${formData.direct_Hours}</p>
        <p>Indirect Hours: ${formData.indirect_Hours}</p>
        <p>Site: ${formData.site}</p>
        <p>Status: ${formData.status}</p>
        <p>Please review the details in your dashboard.</p>
      `,
    });

    console.log("Resend Email Response:", emailResponse);

    // Return success response
    return NextResponse.json(clinicalLog, { status: 200 });
  } catch (error) {
    console.error("Unexpected error:", error);
    return NextResponse.json(
      { error: "Unexpected error occurred" },
      { status: 500 }
    );
  }
};
