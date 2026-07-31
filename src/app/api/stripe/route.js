import AuthUser from "@/middleware/AuthUser";
import { NextResponse } from "next/server";

const stripe = require("stripe")(
  "sk_test_51TzCIH0G2TgWtSnvtrURhs6obToe2zgVDG89zkGbPuSGUbqASqf52WhA3vFz8XeZmzvFtuXNM2jdGYbAFGikGbAb00YqB1Az4t"
);

export const dynamic = "force-dynamic";

export async function POST(req) {
  try {
    const isAuthUser = await AuthUser(req);
    if (isAuthUser) {
      const res = await req.json();

      const session = await stripe.checkout.sessions.create({
        payment_method_types: ["card"],
        line_items: res,
        mode: "payment",
        success_url: `${process.env.SERVER}/checkout` + "?status=success",
        cancel_url: `${process.env.SERVER}/checkout` + "?status=cancel",
      });

      return NextResponse.json({
        success: true,
        id: session.id,
      });
    } else {
      return NextResponse.json({
        success: true,
        message: "You are not authenticated",
      });
    }
  } catch (e) {
    console.log(e);
    return NextResponse.json({
      status: 500,
      success: false,
      message: "Something went wrong ! Please try again",
    });
  }
}
