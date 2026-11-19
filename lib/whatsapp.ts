export const defaultWhatsapp = '919841145873';

// WhatsApp link that opens with a starting message the visitor can edit before sending.
export function whatsappLink(message = 'Hi SP Builders, I would like to discuss a project.', number = defaultWhatsapp) {
  return `https://wa.me/${number.replace(/\D/g, '')}?text=${encodeURIComponent(message)}`;
}

export const telLink = (phone: string) => `tel:${phone.replace(/[^\d+]/g, '')}`;
