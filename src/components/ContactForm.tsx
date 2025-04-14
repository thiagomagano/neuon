import { useState } from "react";
import type { FormEvent } from "react";

interface Feedback {
  message: string;
  type: 'success' | 'error';
}

export default function ContactForm() {
  const [responseMessage, setResponseMessage] = useState("");


  const handleSubmit = async (e: FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    const formData = new FormData(e.target as HTMLFormElement);
    const response = await fetch('/api/contato', {
      method: 'POST',
      body: formData,
    });

    const data = await response.json();
  
    if (data.message) {
      setResponseMessage(data.message);
      console.table(data.data);
    }
}

  return (

  <form 
  name="contato"
  className="grid grid-cols-1 md:grid-cols-2 gap-6"
  onSubmit={handleSubmit}
  >
  <div>
    <input
      type="text"
      name="nome"
      id="nome"
      className="py-4 px-4 block w-full shadow-sm border-gray-300 bg-white focus:ring-primary-500 focus:border-primary-500"
      placeholder="Nome"
      required
      />
  </div>

  <div>
    <input
      type="tel"
      name="telefone"
      id="telefone"
      className="py-4 px-4 block w-full shadow-sm border-gray-300 bg-white focus:ring-primary-500 focus:border-primary-500"
      placeholder="Telefone"
      required
      />
  </div>

  <div className="md:col-span-2">
    <input
      id="email"
      name="email"
      type="email"
      className="py-4 px-4 block w-full shadow-sm border-gray-300 bg-white focus:ring-primary-500 focus:border-primary-500"
      placeholder="E-mail"
      required
      />
  </div>

  <div className="md:col-span-2">
    <textarea
      id="mensagem"
      name="mensagem"
      rows={6}
      className="py-4 px-4 block w-full shadow-sm border-gray-300 bg-white focus:ring-primary-500 focus:border-primary-500"
      placeholder="Escreva sua mensagem aqui."
      required></textarea>
  </div>

  <div className="md:col-span-2 flex justify-end">
    <button
      type="submit"
      className="px-8 py-3 bg-laranja hover:bg-amber-500 text-white font-medium transition-colors duration-200">
      Enviar
    </button>
  </div>
  {responseMessage && <p className="text-red-500">{responseMessage}</p>}
</form>
)
}