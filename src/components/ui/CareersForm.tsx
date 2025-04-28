// src/components/ui/CareersForm.tsx
import { useState, useRef } from 'react';
import type { ChangeEvent, FormEvent } from 'react';
import { z } from 'zod';

// Define o esquema de validação
const formSchema = z.object({
  nome: z.string().min(2, { message: 'O nome deve ter pelo menos 2 caracteres' }),
  telefone: z.string().min(10, { message: 'Digite um telefone válido' }),
  email: z.string().email({ message: 'Digite um email válido' }),
  linkedin: z.string()
    .url({ message: 'Digite uma URL válida' })
    .regex(/linkedin\.com/, { message: 'Digite um perfil válido do LinkedIn' })
    .optional()
    .or(z.literal('')),
  mensagem: z.string().min(10, { message: 'Descreva brevemente sua experiência (mínimo 10 caracteres)' })
});

// Tipos derivados do schema
type FormData = z.infer<typeof formSchema>;
type FormErrors = Partial<Record<keyof FormData, string>>;

// Tipo para o status de submissão
type SubmitStatus = {
  type: 'success' | 'error';
  message: string;
} | null;

export default function CareersForm() {
  // Estados com tipos definidos
  const [formData, setFormData] = useState<FormData>({
    nome: 'THIAGO MAGANO',
    telefone: '51993438767',
    email: 'othymag@gmail.com',
    linkedin: 'https://www.linkedin.com/in/thiagomagano/',
    mensagem: 'Olá, gostaria de me candidatar a vaga de desenvolvedor front-end. Sou desenvolvedor front-end com experiência em React e Next.js. Estou animado para contribuir com a equipe da Neuon.',
  });
  
  const [errors, setErrors] = useState<FormErrors>({});
  const [isSubmitting, setIsSubmitting] = useState<boolean>(false);
  const [submitStatus, setSubmitStatus] = useState<SubmitStatus>(null);
  const [fileName, setFileName] = useState<string>('');
  const [fileError, setFileError] = useState<string>('');
  
  const fileInputRef = useRef<HTMLInputElement>(null);

  // Handler para mudanças nos inputs
  const handleChange = (e: ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    const { name, value } = e.target;
    setFormData(prev => ({ ...prev, [name]: value }));
    
    // Validação em tempo real
    try {
      formSchema.shape[name as keyof FormData]?.parse(value);
      setErrors(prev => ({ ...prev, [name]: undefined }));
    } catch (error) {
      if (error instanceof z.ZodError) {
        setErrors(prev => ({ ...prev, [name]: error.errors[0].message }));
      }
    }
  };

  // Handler para upload de arquivo
  const handleFileChange = (e: ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    setFileError('');
    
    if (!file) {
      setFileName('');
      return;
    }
    
    // Validação do arquivo
    const allowedTypes = ['application/pdf', 'application/msword', 'application/vnd.openxmlformats-officedocument.wordprocessingml.document'];
    const maxSize = 5 * 1024 * 1024; // 5MB
    
    if (!allowedTypes.includes(file.type)) {
      setFileError('Apenas arquivos PDF ou Word são permitidos');
      e.target.value = '';
      setFileName('');
      return;
    }
    
    if (file.size > maxSize) {
      setFileError('O arquivo deve ter no máximo 5MB');
      e.target.value = '';
      setFileName('');
      return;
    }
    
    setFileName(file.name);
  };

  // Função de validação completa
  const validateForm = (): boolean => {
    try {
      formSchema.parse(formData);
      
      // Validar se o arquivo foi selecionado
      if (!fileInputRef.current?.files?.length) {
        setFileError('Por favor, anexe seu currículo');
        return false;
      }
      
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
      const formDataToSend = new FormData();
      
      // Adicionar os campos do formulário
      Object.entries(formData).forEach(([key, value]) => {
        formDataToSend.append(key, value);
      });
      
      // Adicionar o arquivo
      if (fileInputRef.current?.files?.[0]) {
        formDataToSend.append('curriculo', fileInputRef.current.files[0]);
      }
      
      // Enviar dados para o endpoint
      const response = await fetch('/api/send-resume', {
        method: 'POST',
        body: formDataToSend, // Enviar como FormData para lidar com o upload de arquivo
      });
      
      const result = await response.json();
      
      if (response.ok) {
        // Sucesso
        setSubmitStatus({
          type: 'success',
          message: 'Currículo enviado com sucesso! Analisaremos seu perfil e entraremos em contato se houver compatibilidade com nossas vagas.'
        });
        // Limpar formulário
        setFormData({
          nome: '',
          telefone: '',
          email: '',
          linkedin: '',
          mensagem: ''
        });
        setFileName('');
        if (fileInputRef.current) fileInputRef.current.value = '';
        setErrors({});
      } else {
        // Erro do servidor
        setSubmitStatus({
          type: 'error',
          message: result.error || 'Erro ao enviar currículo. Por favor, tente novamente.'
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
          <p className="font-semibold">Currículo enviado com sucesso!</p>
          <p>Obrigado pelo interesse. Analisaremos seu perfil e entraremos em contato caso haja compatibilidade com nossas vagas.</p>
          <button 
            onClick={() => setSubmitStatus(null)}
            className="mt-4 py-2 px-4 bg-green-600 text-white rounded hover:bg-green-700"
          >
            Enviar nova candidatura
          </button>
        </div>
      ) : (
        <form onSubmit={handleSubmit} className="grid grid-cols-1 md:grid-cols-2 gap-6" encType="multipart/form-data">
          {submitStatus?.type === 'error' && (
            <div className="md:col-span-2 bg-red-100 border border-red-400 text-red-700 px-4 py-3 rounded mb-4">
              <p>{submitStatus.message}</p>
            </div>
          )}
          
          <div>
            <label htmlFor="nome" className="block text-sm font-medium text-gray-700 mb-1">Nome completo</label>
            <input 
              type="text" 
              name="nome" 
              id="nome" 
              value={formData.nome}
              onChange={handleChange}
              className={`py-4 px-4 block w-full border-gray-300 bg-white focus:ring-laranja focus:border-laranja ${errors.nome ? 'border-red-500' : 'border-gray-300'}`} 
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
              className={`py-4 px-4 block w-full border-gray-300 bg-white focus:ring-laranja focus:border-laranja ${errors.telefone ? 'border-red-500' : 'border-gray-300'}`} 
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
              className={`py-4 px-4 block w-full border-gray-300 bg-white focus:ring-laranja focus:border-laranja ${errors.email ? 'border-red-500' : 'border-gray-300'}`} 
              required
            />
            {errors.email && <p className="mt-1 text-sm text-red-600">{errors.email}</p>}
          </div>
          
          <div className='md:col-span-2'>
            <label htmlFor="linkedin" className="block text-sm font-medium text-gray-700 mb-1">LinkedIn (opcional)</label>
            <input 
              type="url" 
              name="linkedin" 
              id="linkedin" 
              placeholder="https://www.linkedin.com/in/seu-perfil"
              value={formData.linkedin}
              onChange={handleChange}
              className={`py-4 px-4 block w-full border-gray-300 bg-white focus:ring-laranja focus:border-laranja ${errors.linkedin ? 'border-red-500' : 'border-gray-300'}`}
            />
            {errors.linkedin && <p className="mt-1 text-sm text-red-600">{errors.linkedin}</p>}
          </div>

          <div className='md:col-span-2'>
            <label htmlFor="curriculo" className="block text-sm font-medium text-gray-700 mb-1">Currículo (PDF ou Word, máx. 5MB)</label>
            <div className="flex">
              <input 
                type="file" 
                id="curriculo"
                name="curriculo"
                accept=".pdf,.doc,.docx,application/pdf,application/msword,application/vnd.openxmlformats-officedocument.wordprocessingml.document"
                ref={fileInputRef}
                onChange={handleFileChange}
                className="sr-only"
                required
              />
              <label 
                htmlFor="curriculo" 
                className={`py-3 px-4 w-full flex items-center justify-between cursor-pointer border bg-white text-gray-700 hover:bg-gray-50 ${fileError ? 'border-red-500' : 'border-gray-300'}`}
              >
                <span className="text-sm">
                  {fileName || "Selecione o arquivo..."}
                </span>
                <span className="bg-laranja text-white py-1 px-3 text-sm">
                  Procurar
                </span>
              </label>
            </div>
            {fileError && <p className="mt-1 text-sm text-red-600">{fileError}</p>}
          </div>

          <div className='md:col-span-2'>
            <label htmlFor="mensagem" className="block text-sm font-medium text-gray-700 mb-1">Mensagem (breve apresentação)</label>
            <textarea 
              name="mensagem" 
              id="mensagem" 
              rows={4} 
              value={formData.mensagem}
              onChange={handleChange}
              className={`py-4 px-4 block w-full border-gray-300 bg-white focus:ring-laranja focus:border-laranja ${errors.mensagem ? 'border-red-500' : 'border-gray-300'}`}
              required
            />
            {errors.mensagem && <p className="mt-1 text-sm text-red-600">{errors.mensagem}</p>}
          </div>

          <div className='md:col-span-2 flex justify-end'>
            <button 
              type="submit"
              disabled={isSubmitting}
              className="px-8 py-3 bg-laranja hover:cursor-pointer text-white font-medium focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-azul disabled:bg-amber-200 disabled:cursor-not-allowed transition-all hover:scale-105 duration-300 ease-in-out"
            >
              {isSubmitting ? 'Enviando...' : 'Enviar candidatura'}
            </button>
          </div>
        </form>
      )}
    </div>
  );
}