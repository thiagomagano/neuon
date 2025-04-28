import {
  Body,
  Container,
  Head,
  Heading,
  Html,
  Preview,
  Section,
  Text,
  Hr,
  Link,
} from "@react-email/components";
import * as React from "react";

interface CareersTemplateProps {
  nome: string;
  email: string;
  telefone: string;
  linkedin?: string;
  mensagem: string;
}

export const CareersTemplate: React.FC<Readonly<CareersTemplateProps>> =  ({
  nome,
  email,
  telefone,
  linkedin,
  mensagem,
}) => 
   (
    <Html>
      <Head />
      <Preview>Nova candidatura recebida de {nome}</Preview>
      <Body style={styles.body}>
        <Container style={styles.container}>
          <Heading style={styles.heading}>Nova Candidatura</Heading>
          <Text style={styles.text}>
            Você recebeu uma nova candidatura através do site Neuon.
          </Text>
          
          <Section style={styles.section}>
            <Heading as="h2" style={styles.sectionHeading}>Dados do Candidato</Heading>
            <Text style={styles.fieldLabel}>Nome:</Text>
            <Text style={styles.fieldValue}>{nome}</Text>
            
            <Text style={styles.fieldLabel}>Email:</Text>
            <Text style={styles.fieldValue}>{email}</Text>
            
            <Text style={styles.fieldLabel}>Telefone:</Text>
            <Text style={styles.fieldValue}>{telefone}</Text>
            
            {linkedin && (
              <>
                <Text style={styles.fieldLabel}>LinkedIn:</Text>
                <Link href={linkedin} style={styles.link}>{linkedin}</Link>
              </>
            )}
          </Section>
          
          <Section style={styles.section}>
            <Heading as="h2" style={styles.sectionHeading}>Mensagem do Candidato</Heading>
            <Text style={styles.message}>{mensagem}</Text>
          </Section>
          
          <Hr style={styles.hr} />
          
          <Text style={styles.footer}>
            Este e-mail foi enviado automaticamente pelo sistema de candidaturas do website Neuon.
          </Text>
        </Container>
      </Body>
    </Html>
  );


const styles = {
  body: {
    backgroundColor: "#f6f9fc",
    fontFamily: "-apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, Helvetica, Arial, sans-serif",
  },
  container: {
    margin: "0 auto",
    padding: "20px",
    backgroundColor: "#ffffff",
    borderRadius: "8px",
    maxWidth: "600px",
  },
  heading: {
    color: "#00213e", // azul-escuro
    fontSize: "24px",
    fontWeight: "bold",
    marginBottom: "15px",
  },
  text: {
    color: "#333",
    fontSize: "16px",
    lineHeight: "24px",
    marginBottom: "20px",
  },
  section: {
    marginBottom: "20px",
    padding: "15px",
    backgroundColor: "#f9f9f9",
    borderRadius: "4px",
  },
  sectionHeading: {
    color: "#0637ae", // azul
    fontSize: "18px",
    fontWeight: "bold",
    marginBottom: "15px",
  },
  fieldLabel: {
    color: "#666",
    fontSize: "14px",
    fontWeight: "bold",
    marginBottom: "4px",
  },
  fieldValue: {
    color: "#333",
    fontSize: "16px",
    marginBottom: "15px",
  },
  message: {
    color: "#333",
    fontSize: "16px",
    lineHeight: "24px",
    whiteSpace: "pre-wrap",
  },
  link: {
    color: "#0637ae",
    textDecoration: "underline",
    marginBottom: "15px",
    display: "block",
  },
  hr: {
    borderColor: "#e5e5e5",
    margin: "20px 0",
  },
  footer: {
    color: "#666",
    fontSize: "12px",
    textAlign: "center" as const,
  },
};