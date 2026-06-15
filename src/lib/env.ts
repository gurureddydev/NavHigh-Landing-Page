import { createEnv } from '@t3-oss/env-nextjs';
import { z } from 'zod';

export const env = createEnv({
    server: {
        MONGODB_URI: z
            .string()
            .min(1)
            .default('mongodb+srv://navhigh_db_user:BjEA93E0R02G2SNp@cluster0.no8wtn1.mongodb.net/?appName=Cluster0'),
    },
    client: {
        NEXT_PUBLIC_API_URL: z.string().min(1).default('http://localhost:3000'),
    },
    experimental__runtimeEnv: {
        NEXT_PUBLIC_API_URL: process.env.NEXT_PUBLIC_API_URL || 'http://localhost:3000',
    },
});
