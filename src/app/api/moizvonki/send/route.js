import { NextResponse } from "next/server";

export async function POST(req) {
  try {
    const { phone, type = "call", message } = await req.json();

    let payload = {
      user_name: "impulsmirasmiy@gmail.com",
      api_key: "xtonupdhy7alcvr0b3tqw2x9iaew9ogu",
    };

    if (type === "call") {
      payload = { ...payload, action: "calls.make_call", to: phone };
    }

    if (type === "sms") {
      if (!message)
        return NextResponse.json(
          { ok: false, error: "SMS text required" },
          { status: 400 }
        );

      payload = {
        ...payload,
        action: "calls.send_sms",
        to: phone,
        text: message,
      };
    }

    const res = await fetch("https://imidental.moizvonki.ru/api/v1", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(payload),
    });

    const text = await res.text(); // avval text oling
    let data = {};

    try {
      data = JSON.parse(text); // keyin parse qiling
    } catch (err) {
      console.warn("JSON parse error:", err, "raw response:", text);
    }

    if (!res.ok || data?.ok === false) {
      return NextResponse.json(
        { ok: false, status: res.status, data: data || text },
        { status: res.status }
      );
    }

    return NextResponse.json({ ok: true, response: data || text });
  } catch (err) {
    console.error("MOIZVONKI ERROR:", err);
    return NextResponse.json(
      { ok: false, error: "server_error" },
      { status: 500 }
    );
  }
}
