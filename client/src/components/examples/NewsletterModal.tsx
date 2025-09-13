import { useState } from 'react';
import NewsletterModal from '../NewsletterModal';
import { Button } from '@/components/ui/button';

export default function NewsletterModalExample() {
  const [isOpen, setIsOpen] = useState(true);

  return (
    <div>
      <Button onClick={() => setIsOpen(true)}>Open Newsletter Modal</Button>
      <NewsletterModal isOpen={isOpen} onClose={() => setIsOpen(false)} />
    </div>
  );
}