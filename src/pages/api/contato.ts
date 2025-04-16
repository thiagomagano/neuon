export const prerender = false;
import type { APIRoute } from "astro";

import { Resend } from "resend";
import ContactTemplate from "../../emails/ContactTemplate";

const RESEND_API_KEY = import.meta.env.RESEND_API_KEY;
const RESEND_FROM_EMAIL = import.meta.env.RESEND_FROM_EMAIL;
const CONTACT_FORM_TO_EMAIL = import.meta.env.CONTACT_FORM_TO_EMAIL;

if (!RESEND_API_KEY || !RESEND_FROM_EMAIL || !CONTACT_FORM_TO_EMAIL) {
  console.error("Missing required environment variables for Resend.");
}

const resend = new Resend(RESEND_API_KEY);

export const POST: APIRoute = async ({ request, redirect }) => {
  let formData;
  try {
    formData = await request.formData();
  } catch (e) {
    console.error("Error parsing form data:", e);
    return redirect("/contato?error=invalid_request", 307);
  }

  const name = formData.get("nome");
  const phone = formData.get("telefone");
  const email = formData.get("email");
  const message = formData.get("mensagem");

  if (!name || !phone || !email || !message) {
    console.error("API Validation failed: Missing fields");
    return redirect("/contato?error=missing_fields", 307);
  }

  if (
    typeof name !== "string" ||
    typeof email !== "string" ||
    typeof message !== "string" ||
    (phone && typeof phone !== "string")
  ) {
    console.error("API Validation failed: Invalid field types");
    return redirect("/contato?error=invalid_data", 307);
  }

  //TODO Validar se o telefone é esta no formato correto com regex (DD 9xxxx-xxxxx)

  try {
    console.log("API Route: Sending email via Resend...");
    console.log("To:", CONTACT_FORM_TO_EMAIL);
    console.log("From:", RESEND_FROM_EMAIL);

    const { data, error } = await resend.emails.send({
      from: RESEND_FROM_EMAIL!,
      to: [CONTACT_FORM_TO_EMAIL!], //TODO colocar quem quer receber o email do site aqui
      subject: `Contato via neuon.com.br de: ${name}`,
      replyTo: email,
      react: await ContactTemplate({ name, email, phone, message }), // Use the React email template
    });

    if (error) {
      console.error("Resend API error:", error);
      return redirect("/contato?error=send_failed", 307);
    }

    console.log("API Route: Email sent successfully:", data);
    // Redirect on success
    return redirect("/contato?success=true", 302);
  } catch (e: unknown) {
    console.error("API Route: Unexpected error:", e);
    // Redirect on generic error
    return redirect("/contato?error=server_error", 307);
  }
};

// Caso usuário tente acessar a rota diretamente via browser, redireciona para a página de contato
export const GET: APIRoute = ({ redirect }) => {
  return redirect("/contato", 301);
};
