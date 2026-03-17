import { useState } from 'react';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import * as z from 'zod';
import { motion } from 'framer-motion';
import { Loader2, CheckCircle2, Send } from 'lucide-react';
import confetti from 'canvas-confetti';
import {
  Form, FormControl, FormField, FormItem, FormLabel, FormMessage,
} from '@/components/ui/form';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import {
  Select, SelectContent, SelectItem, SelectTrigger, SelectValue,
} from '@/components/ui/select';
import { Button } from '@/components/ui/button';

const contactFormSchema = z.object({
  name: z.string().trim().min(2, { message: 'Name must be at least 2 characters' }).max(100),
  email: z.string().trim().email({ message: 'Please enter a valid email address' }).max(255),
  projectType: z.enum(['collaboration', 'freelance', 'internship'], {
    required_error: 'Please select an inquiry type',
  }),
  message: z.string().trim().min(10, { message: 'Message must be at least 10 characters' }).max(1000),
});

type ContactFormValues = z.infer<typeof contactFormSchema>;

export function ContactForm() {
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [isSuccess, setIsSuccess] = useState(false);

  const form = useForm<ContactFormValues>({
    resolver: zodResolver(contactFormSchema),
    defaultValues: { name: '', email: '', projectType: undefined, message: '' },
  });

  const onSubmit = async (data: ContactFormValues) => {
    setIsSubmitting(true);
    try {
      const { supabase } = await import('@/integrations/supabase/client');
      const { data: result, error } = await supabase.functions.invoke('send-contact-email', {
        body: {
          name: data.name,
          email: data.email,
          projectType: data.projectType,
          message: data.message,
        },
      });
      if (error) throw new Error('Failed to send message');
      
      // Trigger delightful confetti animation on success
      const duration = 3 * 1000;
      const animationEnd = Date.now() + duration;
      const defaults = { startVelocity: 30, spread: 360, ticks: 60, zIndex: 100 };

      const randomInRange = (min: number, max: number) => Math.random() * (max - min) + min;

      const interval: any = setInterval(function() {
        const timeLeft = animationEnd - Date.now();

        if (timeLeft <= 0) {
          return clearInterval(interval);
        }

        const particleCount = 50 * (timeLeft / duration);
        confetti({
          ...defaults, particleCount,
          origin: { x: randomInRange(0.1, 0.3), y: Math.random() - 0.2 }
        });
        confetti({
          ...defaults, particleCount,
          origin: { x: randomInRange(0.7, 0.9), y: Math.random() - 0.2 }
        });
      }, 250);

      setIsSuccess(true);
      form.reset();
      setTimeout(() => setIsSuccess(false), 5000);
    } catch {
      form.setError('root', { message: 'Failed to send message. Please try again.' });
    } finally {
      setIsSubmitting(false);
    }
  };

  if (isSuccess) {
    return (
      <motion.div
        initial={{ opacity: 0, scale: 0.95 }}
        animate={{ opacity: 1, scale: 1 }}
        transition={{ duration: 0.5 }}
        className="relative overflow-hidden rounded-2xl border border-border bg-card p-10 text-center"
      >
        <div className="absolute inset-0 bg-gradient-to-br from-primary/5 via-transparent to-accent/10" />
        <div className="relative space-y-4">
          <motion.div
            initial={{ scale: 0, rotate: -180 }}
            animate={{ scale: 1, rotate: 0 }}
            transition={{ delay: 0.2, type: 'spring', stiffness: 200 }}
          >
            <div className="mx-auto flex size-16 items-center justify-center rounded-full bg-primary/10">
              <CheckCircle2 className="size-8 text-primary" />
            </div>
          </motion.div>
          <h3 className="font-display text-3xl italic tracking-wide">Message Sent!</h3>
          <p className="text-sm text-muted-foreground font-body leading-relaxed max-w-xs mx-auto">
            Thank you for reaching out. I'll get back to you within 24–48 hours.
          </p>
        </div>
      </motion.div>
    );
  }

  const fieldVariants = {
    hidden: { opacity: 0, y: 12 },
    visible: (i: number) => ({
      opacity: 1,
      y: 0,
      transition: { delay: i * 0.08, duration: 0.4 },
    }),
  };

  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      className="relative overflow-hidden rounded-2xl border border-border bg-card"
    >
      {/* Decorative gradient strip */}
      <div className="h-1.5 w-full bg-gradient-to-r from-primary via-muted-foreground/50 to-primary/20" />

      <div className="p-6 md:p-8">
        <Form {...form}>
          <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-6">
            {/* Name & Email row */}
            <div className="grid sm:grid-cols-2 gap-5">
              <motion.div custom={0} variants={fieldVariants} initial="hidden" animate="visible">
                <FormField control={form.control} name="name" render={({ field }) => (
                  <FormItem>
                    <FormLabel className="text-xs font-body tracking-wide uppercase text-muted-foreground">Name</FormLabel>
                    <FormControl>
                      <Input
                        placeholder="Your full name"
                        className="font-body h-11 border-border/60 bg-background focus-visible:ring-primary/30 transition-shadow"
                        {...field}
                      />
                    </FormControl>
                    <FormMessage className="text-xs font-body" />
                  </FormItem>
                )} />
              </motion.div>

              <motion.div custom={1} variants={fieldVariants} initial="hidden" animate="visible">
                <FormField control={form.control} name="email" render={({ field }) => (
                  <FormItem>
                    <FormLabel className="text-xs font-body tracking-wide uppercase text-muted-foreground">Email</FormLabel>
                    <FormControl>
                      <Input
                        type="email"
                        placeholder="your.email@example.com"
                        className="font-body h-11 border-border/60 bg-background focus-visible:ring-primary/30 transition-shadow"
                        {...field}
                      />
                    </FormControl>
                    <FormMessage className="text-xs font-body" />
                  </FormItem>
                )} />
              </motion.div>
            </div>

            <motion.div custom={2} variants={fieldVariants} initial="hidden" animate="visible">
              <FormField control={form.control} name="projectType" render={({ field }) => (
                <FormItem>
                  <FormLabel className="text-xs font-body tracking-wide uppercase text-muted-foreground">Inquiry Type</FormLabel>
                  <Select onValueChange={field.onChange} defaultValue={field.value}>
                    <FormControl>
                      <SelectTrigger className="font-body h-11 border-border/60 bg-background">
                        <SelectValue placeholder="Select inquiry type" />
                      </SelectTrigger>
                    </FormControl>
                    <SelectContent className="bg-card border border-border shadow-lg z-50">
                      <SelectItem value="collaboration" className="font-body">Collaboration</SelectItem>
                      <SelectItem value="freelance" className="font-body">Freelance Project</SelectItem>
                      <SelectItem value="internship" className="font-body">Internship Opportunity</SelectItem>
                    </SelectContent>
                  </Select>
                  <FormMessage className="text-xs font-body" />
                </FormItem>
              )} />
            </motion.div>

            <motion.div custom={3} variants={fieldVariants} initial="hidden" animate="visible">
              <FormField control={form.control} name="message" render={({ field }) => (
                <FormItem>
                  <FormLabel className="text-xs font-body tracking-wide uppercase text-muted-foreground">Message</FormLabel>
                  <FormControl>
                    <Textarea
                      placeholder="Tell me about your project or opportunity..."
                      className="min-h-36 font-body resize-none border-border/60 bg-background focus-visible:ring-primary/30 transition-shadow"
                      {...field}
                    />
                  </FormControl>
                  <FormMessage className="text-xs font-body" />
                </FormItem>
              )} />
            </motion.div>

            {form.formState.errors.root && (
              <motion.div
                initial={{ opacity: 0, y: -8 }}
                animate={{ opacity: 1, y: 0 }}
                className="rounded-lg bg-destructive/10 border border-destructive/20 px-4 py-3 text-sm text-destructive font-body"
              >
                {form.formState.errors.root.message}
              </motion.div>
            )}

            <motion.div custom={4} variants={fieldVariants} initial="hidden" animate="visible">
              <Button
                type="submit"
                className="w-full font-body h-12 text-sm tracking-wide uppercase bg-primary hover:bg-primary/90 transition-all duration-300 shadow-lg shadow-primary/10 hover:shadow-xl hover:shadow-primary/20"
                disabled={isSubmitting}
              >
                {isSubmitting ? (
                  <><Loader2 className="mr-2 size-4 animate-spin" />Sending...</>
                ) : (
                  <><Send className="mr-2 size-4" />Send Message</>
                )}
              </Button>
            </motion.div>
          </form>
        </Form>
      </div>
    </motion.div>
  );
}
