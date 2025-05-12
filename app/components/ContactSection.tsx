'use client';
import { motion } from 'framer-motion';
import { Typography, Box, TextField, Button, useTheme, CircularProgress, Alert, Link as MuiLink, alpha } from '@mui/material';
import SendIcon from '@mui/icons-material/Send';
import React, { useState } from 'react';
import LinkedInIcon from '@mui/icons-material/LinkedIn';

interface ContactSectionProps { id?: string; }

const sectionTitleVariants = {
  hidden: { opacity: 0, y: -20 },
  visible: { opacity: 1, y: 0, transition: { duration: 0.5 } }
};

const formVariants = {
  hidden: { opacity: 0, y: 50 },
  visible: { opacity: 1, y: 0, transition: { duration: 0.8, ease: 'easeOut' } }
};

export default function ContactSection({ id }: ContactSectionProps) {
  const theme = useTheme();
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [submitStatus, setSubmitStatus] = useState<{ type: 'success' | 'error' | 'info'; message: string } | null>(null);

  // --- Constantes para Integração com Google Forms ---
  const GOOGLE_FORM_FIELD_NAME_ID = "entry.969752962";
  const GOOGLE_FORM_FIELD_EMAIL_ID = "entry.235121393";
  const GOOGLE_FORM_FIELD_SUBJECT_ID = "entry.851357595";
  const GOOGLE_FORM_FIELD_MESSAGE_ID = "entry.1626820357";
  const GOOGLE_FORM_ACTION_URL = "https://docs.google.com/forms/d/e/1FAIpQLScn9xPUWdIeJhxfIS7YhULuuTCgWqWGgdERte9-9Ze80nICtw/formResponse";
  // --- Fim das Constantes ---

  const handleSubmit = async (event: React.FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    setIsSubmitting(true);
    setSubmitStatus(null);

    const formData = new FormData(event.currentTarget);
    const dataToSubmit = new URLSearchParams();

    dataToSubmit.append(GOOGLE_FORM_FIELD_NAME_ID, formData.get('name') as string);
    dataToSubmit.append(GOOGLE_FORM_FIELD_EMAIL_ID, formData.get('email') as string);
    dataToSubmit.append(GOOGLE_FORM_FIELD_SUBJECT_ID, formData.get('subject') as string);
    dataToSubmit.append(GOOGLE_FORM_FIELD_MESSAGE_ID, formData.get('message') as string);

    try {
      await fetch(GOOGLE_FORM_ACTION_URL, {
        method: 'POST',
        body: dataToSubmit,
      });

      setSubmitStatus({ type: 'success', message: 'Mensagem enviada! Obrigado pelo contato.' });
      (event.target as HTMLFormElement).reset();

    } catch (error) {
      console.error("Erro durante envio para Google Forms:", error);
      setSubmitStatus({
        type: 'info', 
        message: 'Sua mensagem foi processada. Se não receber uma resposta em breve, por favor, tente por LinkedIn.'
      });
       (event.target as HTMLFormElement).reset();
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <Box component="section" id={id}
      sx={{
        position: 'relative', zIndex: 1,
        py: { xs: 6, md: 10 }, px: { xs: 2, md: 4 },
        bgcolor: alpha(theme.palette.background.default, 0.50),
         }}
    >
      <motion.div variants={sectionTitleVariants} initial="hidden" whileInView="visible" viewport={{ once: true, amount: 0.5 }}>
        <Typography variant="h2" component="h2" gutterBottom sx={{ textAlign: 'center', color: 'primary.main', mb: { xs: 6, md: 8 }, fontWeight: 700 }}> Entre em Contato </Typography>
      </motion.div>
      <Box component={motion.form} variants={formVariants} initial="hidden" whileInView="visible" viewport={{ once: true, amount: 0.2 }} onSubmit={handleSubmit}
        sx={{ maxWidth: '700px', margin: '0 auto', padding: { xs: 3, sm: 4 }, borderRadius: theme.shape.borderRadius * 3, bgcolor: 'background.paper', boxShadow: theme.shadows[5] }}
      >
        {submitStatus && ( <Alert severity={submitStatus.type} sx={{ mb: 3 }} onClose={() => setSubmitStatus(null)}> {submitStatus.message} </Alert> )}
        <TextField fullWidth label="Seu Nome" name="name" variant="outlined" margin="normal" required sx={{ mb: 2 }} disabled={isSubmitting} />
        <TextField fullWidth label="Seu Email" name="email" type="email" variant="outlined" margin="normal" required sx={{ mb: 2 }} disabled={isSubmitting} />
        <TextField fullWidth label="Assunto" name="subject" variant="outlined" margin="normal" sx={{ mb: 2 }} disabled={isSubmitting} />
        <TextField fullWidth label="Sua Mensagem" name="message" variant="outlined" multiline rows={5} margin="normal" required sx={{ mb: 3 }} disabled={isSubmitting} />
        <Button type="submit" variant="pill" color="accent" size="large" fullWidth disabled={isSubmitting} startIcon={isSubmitting ? <CircularProgress size={20} color="inherit" /> : <SendIcon />} sx={{ py: 1.5 }} >
          {isSubmitting ? 'Enviando...' : 'Enviar Mensagem'}
        </Button>
         <Typography variant="caption" display="block" sx={{ mt: 2, textAlign: 'center', color: 'text.disabled' }}>
            Se preferir, pode me contatar via {' '}
            <MuiLink
                href="https://linkedin.com/in/robsavoldi"
                target="_blank" rel="noopener noreferrer" color="secondary"
                sx={{ display: 'inline-flex', alignItems: 'center', verticalAlign: 'middle' }}
            >
                LinkedIn <LinkedInIcon fontSize="inherit" sx={{ ml: 0.5 }} />
            </MuiLink>.
        </Typography>
      </Box>
    </Box>
  );
}