import * as React from 'react';
import { Html, Heading, Text, Container, Section } from '@react-email/components';

interface ContactEmailProps {
  name: string;
  email: string;
  phone: string;
  message: string;
}

export const ContactEmail: React.FC<Readonly<ContactEmailProps>> = ({
  name,
  email,
  phone,
  message,
}) => (
  <Html lang="pt-BR">
    <Container>
      <Heading as="h2">Contato via neuon.com.br de: {name}</Heading>
      <Section>
        <Text><strong>Nome:</strong> {name}</Text>
        <Text><strong>Email:</strong> {email}</Text>
        {phone && <Text><strong>Telefone:</strong> {phone}</Text>}
        <Text><strong>Mensagem:</strong></Text>
        <Text>{message}</Text>
      </Section>
    </Container>
  </Html>
);

export default ContactEmail;