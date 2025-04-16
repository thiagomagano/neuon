import { useState } from "react";
import { z } from "astro:content"

interface Feedback {
  message: string;
  type: 'success' | 'error';
}
interface ContactFormProps {
  serverFeedback?: Feedback | null;
}


export default function ContactForm({serverFeedback}: ContactFormProps) {
  const [feedback, setFeedback] = useState<Feedback | null>(serverFeedback || null);

  const handleInputChange = () => {
    if (feedback) setFeedback(null);
}
  

  return (

      <form 
        name="contato"
        className="grid grid-cols-1 md:grid-cols-2 gap-6"
        action='/api/contato'
        method="POST"
      >
      <div>
        <input
          type="text"
          name="nome"
          id="nome"
          className="py-4 px-4 block w-full shadow-sm border-gray-300 bg-white focus:ring-primary-500 focus:border-primary-500"
          placeholder="Nome"
          onChange={handleInputChange}
          />
      </div>

      <div>
        <input
          type="tel"
          name="telefone"
          id="telefone"
          className="py-4 px-4 block w-full shadow-sm border-gray-300 bg-white focus:ring-primary-500 focus:border-primary-500"
          placeholder="Telefone"
          onChange={handleInputChange}
          />
      </div>

      <div className="md:col-span-2">
        <input
          id="email"
          name="email"
          type="email"
          className="py-4 px-4 block w-full shadow-sm border-gray-300 bg-white focus:ring-primary-500 focus:border-primary-500"
          placeholder="E-mail"
          onChange={handleInputChange}
          />
      </div>

      <div className="md:col-span-2">
        <textarea
          id="mensagem"
          name="mensagem"
          rows={6}
          className="py-4 px-4 block w-full shadow-sm border-gray-300 bg-white focus:ring-primary-500 focus:border-primary-500"
          placeholder="Escreva sua mensagem aqui."
          onChange={handleInputChange}
          ></textarea>
      </div>

      {feedback && (
            <div className={`p-3 text-sm ${feedback.type === 'success' ? 'bg-green-100 text-green-800' : 'bg-red-100 text-red-800'}`}>
              {feedback.message}
            </div>
          )}

      <div className="md:col-span-2 flex justify-end">
        <button
          type="submit"
          className="px-8 py-3 bg-laranja hover:bg-amber-500 text-white font-medium transition-colors duration-200">
          Enviar
        </button>
      </div>
        
    </form>
  )
}