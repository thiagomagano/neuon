// src/pages/api/send-email.ts
import type { APIRoute } from "astro";
import { Resend } from "resend";
import ContactTemplate from "../../emails/ContactTemplate";

export const prerender = false;

// Interface para os dados do formulário
interface FormData {
  nome: string;
  email: string;
  telefone: string;
  mensagem: string;
}

// Inicialize o Resend com sua chave API
const resend = new Resend(import.meta.env.RESEND_API_KEY);
const RESEND_FROM_EMAIL = import.meta.env.RESEND_FROM_EMAIL;
const CONTACT_FORM_TO_EMAIL = import.meta.env.CONTACT_FORM_TO_EMAIL;

// Lista de destinatários da empresa
const NEUON_EMAILS: string[] = [CONTACT_FORM_TO_EMAIL]; //TODO colocar quem quer receber o email do site aqui

export const POST: APIRoute = async ({ request }) => {
  try {
    const body = (await request.json()) as FormData;
    const { nome, email, telefone, mensagem } = body;

    // Validação básica dos dados
    if (!nome || !email || !telefone || !mensagem) {
      return new Response(
        JSON.stringify({
          error: "Todos os campos são obrigatórios",
        }),
        { status: 400 }
      );
    }

    // Envio de email usando Resend
    const data = await resend.emails.send({
      from: RESEND_FROM_EMAIL!,
      to: NEUON_EMAILS,
      subject: `Contato via neuon.com.br de: ${nome}`,
      react: await ContactTemplate({ nome, email, telefone, mensagem }),
    });

    return new Response(
      JSON.stringify({ message: "Email enviado com sucesso" }),
      { status: 200 }
    );
  } catch (error) {
    console.error("Erro ao enviar email:", error);

    let errorMessage = "Falha ao enviar email";
    if (error instanceof Error) {
      errorMessage = error.message;
    }

    return new Response(JSON.stringify({ error: errorMessage }), {
      status: 500,
    });
  }
};

export const GET: APIRoute = async () => {
  return new Response(JSON.stringify({ message: "GET não permitido" }), {
    status: 405,
  });
};
