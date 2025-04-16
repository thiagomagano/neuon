import * as React from 'react';
import { Html, Heading, Text, Container, Section } from '@react-email/components';

interface ContactEmailProps {
  nome: string;
  email: string;
  telefone: string;
  mensagem: string;
}

export const ContactEmail: React.FC<Readonly<ContactEmailProps>> = ({
  nome,
  email,
  telefone,
  mensagem,
}) => (
  <Html lang="pt-BR">
    <Container>
      <Heading as="h2">Contato via neuon.com.br de: {nome}</Heading>
      <Section>
        <Text><strong>Nome:</strong> {nome}</Text>
        <Text><strong>Email:</strong> {email}</Text>
        <Text><strong>Telefone:</strong> {telefone}</Text>
        <Text><strong>Mensagem:</strong></Text>
        <Text>{mensagem}</Text>
      </Section>
    </Container>
  </Html>
);

export default ContactEmail;