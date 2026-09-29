import {z} from 'zod';
export const enquirySchema=z.object({name:z.string().trim().min(2,'Enter your name.').max(100),email:z.email('Enter a valid email address.').max(254),phone:z.string().trim().regex(/^[+\d\s()-]{7,24}$/,'Enter a valid phone number.'),projectType:z.enum(['Residential apartments','Individual villa','Construction or renovation','Other enquiry']),message:z.string().trim().min(10,'Please include at least 10 characters.').max(500,'Please keep your message within 500 characters.'),consent:z.literal(true),website:z.string().max(0).optional()});

