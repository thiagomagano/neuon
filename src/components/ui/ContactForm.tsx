// ContactForm.tsx
import { useState} from 'react';
import type {ChangeEvent, FormEvent} from 'react';
import { z } from 'zod';

// Define o esquema de validação
const formSchema = z.object({
  nome: z.string().min(2, { message: 'O nome deve ter pelo menos 2 caracteres' }),
  telefone: z.string().min(10, { message: 'Digite um telefone válido' }),
  email: z.string().email({ message: 'Digite um email válido' }),
  mensagem: z.string().min(10, { message: 'A mensagem deve ter pelo menos 10 caracteres' })
});

// Tipos derivados do schema
type FormData = z.infer<typeof formSchema>;
type FormErrors = Partial<Record<keyof FormData, string>>;

// Tipo para o status de submissão
type SubmitStatus = {
  type: 'success' | 'error';
  message: string;
} | null;


export default function ContactForm() {
  // Estados com tipos definidos
  const [formData, setFormData] = useState<FormData>({
    nome: '',
    telefone: '',
    email: '',
    mensagem: ''
  });
  const [errors, setErrors] = useState<FormErrors>({});
  const [isSubmitting, setIsSubmitting] = useState<boolean>(false);
  const [submitStatus, setSubmitStatus] = useState<SubmitStatus>(null);

  // Handler para mudanças nos inputs
  const handleChange = (e: ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    const { name, value } = e.target;
    setFormData(prev => ({ ...prev, [name]: value }));
    
    // Validação em tempo real (opcional)
    try {
      // O 'as keyof FormData' garante que name é uma chave válida de FormData
      formSchema.shape[name as keyof FormData].parse(value);
      setErrors(prev => ({ ...prev, [name]: undefined }));
    } catch (error) {
      if (error instanceof z.ZodError) {
        setErrors(prev => ({ ...prev, [name]: error.errors[0].message }));
      }
    }
  };

  // Função de validação completa
  const validateForm = (): boolean => {
    try {
      formSchema.parse(formData);
      return true;
    } catch (error) {
      if (error instanceof z.ZodError) {
        const formattedErrors: FormErrors = {};
        error.errors.forEach(err => {
          if (err.path[0]) {
            formattedErrors[err.path[0] as keyof FormData] = err.message;
          }
        });
        setErrors(formattedErrors);
      }
      return false;
    }
  };

  // Handler para submissão do formulário
  const handleSubmit = async (e: FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    
    // Limpar status anterior
    setSubmitStatus(null);
    
    // Validar formulário
    const isValid = validateForm();
    if (!isValid) return;
    
    setIsSubmitting(true);
    
    try {
      // Enviar dados para o endpoint do Resend
      const response = await fetch('/api/send-email', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(formData),
      });
      
      const result = await response.json();
      
      if (response.ok) {
        // Sucesso
        setSubmitStatus({
          type: 'success',
          message: 'Mensagem enviada com sucesso! Entraremos em contato em breve.'
        });
        // Limpar formulário
        setFormData({
          nome: '',
          telefone: '',
          email: '',
          mensagem: ''
        });
        setErrors({});
      } else {
        // Erro do servidor
        setSubmitStatus({
          type: 'error',
          message: result.error || 'Erro ao enviar mensagem. Por favor, tente novamente.'
        });
      }
    } catch (error) {
      // Erro de rede ou outro tipo de erro
      setSubmitStatus({
        type: 'error',
        message: 'Erro de conexão. Por favor, verifique sua internet e tente novamente.'
      });
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="">
      {submitStatus?.type === 'success' ? (
        <div className="bg-green-100 border border-green-400 text-green-700 px-4 py-3 rounded">
          <p className="font-semibold">Mensagem enviada com sucesso!</p>
          <p>Obrigado por entrar em contato, responderemos em breve.</p>
          <button 
            onClick={() => setSubmitStatus(null)}
            className="mt-2 py-1 px-3 bg-green-600 text-white rounded hover:bg-green-700"
          >
            Enviar nova mensagem
          </button>
        </div>
      ) : (
        <form onSubmit={handleSubmit} className="grid grid-cols-1 md:grid-cols-2 gap-6">
          {submitStatus?.type === 'error' && (
            <div className="bg-red-100 border border-red-400 text-red-700 px-4 py-3 rounded">
              <p>{submitStatus.message}</p>
            </div>
          )}
          
          <div>
            <label htmlFor="nome" className="block text-sm font-medium text-gray-700 mb-1">Nome</label>
            <input 
              type="text" 
              name="nome" 
              id="nome" 
              value={formData.nome}
              onChange={handleChange}
              className={`py-4 px-4 block w-full  border-gray-300 bg-white focus:ring-laranja focus:border-laranja ${errors.nome ? 'border-red-500' : 'border-gray-300'}`} 
              required
            />
            {errors.nome && <p className="mt-1 text-sm text-red-600">{errors.nome}</p>}
          </div>

          <div>
            <label htmlFor="telefone" className="block text-sm font-medium text-gray-700 mb-1">Telefone</label>
            <input 
              type="tel" 
              name="telefone" 
              id="telefone" 
              value={formData.telefone}
              onChange={handleChange}
              className={`py-4 px-4 block w-full  border-gray-300 bg-white focus:ring-laranja focus:border-laranja ${errors.telefone ? 'border-red-500' : 'border-gray-300'}`} 
              required
            />
            {errors.telefone && <p className="mt-1 text-sm text-red-600">{errors.telefone}</p>}
          </div> 

          <div className='md:col-span-2'>
            <label htmlFor="email" className="block text-sm font-medium text-gray-700 mb-1">Email</label>
            <input 
              type="email" 
              name="email" 
              id="email" 
              value={formData.email}
              onChange={handleChange}
              className={`py-4 px-4 block w-full  border-gray-300 bg-white focus:ring-laranja focus:border-laranja${errors.email ? 'border-red-500' : 'border-gray-300'}`} 
              required
            />
            {errors.email && <p className="mt-1 text-sm text-red-600">{errors.email}</p>}
          </div>

          <div className='md:col-span-2'>
            <label htmlFor="mensagem" className="block text-sm font-medium text-gray-700 mb-1">Mensagem</label>
            <textarea 
              name="mensagem" 
              id="mensagem" 
              rows={4} 
              value={formData.mensagem}
              onChange={handleChange}
              className={`py-4 px-4 block w-full  border-gray-300 bg-white focus:ring-laranja focus:border-laranja ${errors.mensagem ? 'border-red-500' : 'border-gray-300'}`}
              required
            />
            {errors.mensagem && <p className="mt-1 text-sm text-red-600">{errors.mensagem}</p>}
          </div>

          <div className='md:col-span-2 flex justify-end'>
            <button 
              type="submit"
              disabled={isSubmitting}
              className="px-8 py-3 bg-laranja hover:cursor-pointer text-white font-medium  focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-azul disabled:bg-amber-200 disabled:cursor-not-allowed transition-all hover:scale-105 duration-300 ease-in-out"
            >
              {isSubmitting ? 'Enviando...' : 'Enviar'}
            </button>
          </div>
        </form>
      )}
    </div>
  );
}