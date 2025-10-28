import { NextRequest, NextResponse } from "next/server";
import type { AdjustDeviceResponse } from "@/app/types/adjust";

export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    const { adid, adjustToken, url } = body;

    if (!adid || !adjustToken || !url) {
      return NextResponse.json(
        { error: "Missing required parameters: adid, adjustToken, or url" },
        { status: 400 }
      );
    }

    // Get Adjust Auth Token from environment
    const adjustAuthToken = process.env.ADJUST_AUTH_TOKEN;
    if (!adjustAuthToken) {
      return NextResponse.json(
        { error: "ADJUST_AUTH_TOKEN not configured" },
        { status: 500 }
      );
    }

    // Call Adjust API
    const adjustApiUrl = `https://api.adjust.com/device_service/api/v2/inspect_device?advertising_id=${adid}&app_token=${adjustToken}`;

    const adjustResponse = await fetch(adjustApiUrl, {
      method: "GET",
      headers: {
        Authorization: `Bearer ${adjustAuthToken}`,
      },
    });

    console.debug(adjustResponse);

    let trackerName = "InitializationError";

    if (!adjustResponse.ok) {
      const errorText = await adjustResponse.text();
      console.error("Adjust API error:", errorText);
      // Continue with InitializationError as tracker name
    } else {
      try {
        const adjustData: AdjustDeviceResponse = await adjustResponse.json();
        trackerName = adjustData.TrackerName || "InitializationError";
      } catch (parseError) {
        console.error("Failed to parse Adjust API response:", parseError);
        // Keep InitializationError as tracker name
      }
    }

    // Log for debugging
    console.debug("Original URL:", url);
    console.debug("ADID:", adid);
    console.debug("Tracker Name:", trackerName);

    // Replace placeholders in the URL with actual values
    let redirectUrl = url
      .replace(/{adid}/g, adid)
      .replace(/{tracker_name}/g, trackerName);

    console.log("Redirect URL:", redirectUrl);

    return NextResponse.json({
      success: true,
      redirectUrl: redirectUrl,
      trackerName: trackerName,
      adid: adid,
    });
  } catch (error) {
    console.error("Error processing request:", error);
    return NextResponse.json(
      { error: "Internal server error" },
      { status: 500 }
    );
  }
}
