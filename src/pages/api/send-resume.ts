import type { APIRoute } from "astro";
import { Resend } from "resend";
import { join } from "path";
import { writeFile, mkdir } from "fs/promises";
import { randomUUID } from "crypto";
import { CareersTemplate } from "../../emails/CareersTemplate";

export const prerender = false;

// Inicialize o Resend com sua chave API
const resend = new Resend(import.meta.env.RESEND_API_KEY);
const RESEND_FROM_EMAIL = import.meta.env.RESEND_FROM_EMAIL;
const CAREERS_FORM_TO_EMAIL = import.meta.env.CONTACT_FORM_TO_EMAIL;

// Lista de destinatários do RH
const HR_EMAILS: string[] = [CAREERS_FORM_TO_EMAIL]; // Substitua ou adicione os emails dos responsáveis por RH

// Função para salvar o arquivo temporariamente
async function saveFile(file: File): Promise<string> {
  // Cria diretório temporário para armazenar o arquivo
  const uploadsDir = join(process.cwd(), "uploads");
  try {
    await mkdir(uploadsDir, { recursive: true });
  } catch (error) {
    console.error("Erro ao criar diretório de uploads:", error);
  }

  // Gera um nome único para o arquivo
  const fileExtension = file.name.split(".").pop();
  const fileName = `${randomUUID()}.${fileExtension}`;
  const filePath = join(uploadsDir, fileName);

  // Salva o arquivo
  const arrayBuffer = await file.arrayBuffer();
  await writeFile(filePath, Buffer.from(arrayBuffer));

  return filePath;
}

export const POST: APIRoute = async ({ request }) => {
  try {
    // Como estamos usando FormData, precisamos processar o corpo da requisição
    const formData = await request.formData();

    // Extrair informações do formulário
    const nome = formData.get("nome") as string;
    const email = formData.get("email") as string;
    const telefone = formData.get("telefone") as string;
    const linkedin = formData.get("linkedin") as string;
    const mensagem = formData.get("mensagem") as string;
    const curriculo = formData.get("curriculo") as File;

    // Validação básica
    if (!nome || !email || !telefone || !mensagem || !curriculo) {
      return new Response(
        JSON.stringify({
          error: "Todos os campos obrigatórios precisam ser preenchidos",
        }),
        { status: 400 }
      );
    }

    // Salva o arquivo para anexar ao email
    const filePath = await saveFile(curriculo);

    // Preparar dados para o email
    const emailData = {
      from: RESEND_FROM_EMAIL!,
      to: HR_EMAILS,
      subject: `Candidatura via neuon.com.br: ${nome}`,
      react: await CareersTemplate({
        nome,
        email,
        telefone,
        linkedin,
        mensagem,
      }),
      attachments: [
        {
          filename: curriculo.name,
          path: filePath,
        },
      ],
    };

    // Enviar email
    const data = await resend.emails.send(emailData);

    // Resposta de sucesso
    return new Response(
      JSON.stringify({ message: "Currículo enviado com sucesso" }),
      { status: 200 }
    );
  } catch (error) {
    console.error("Erro ao processar candidatura:", error);

    let errorMessage = "Falha ao enviar currículo";
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
