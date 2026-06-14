import type { Metadata } from 'next';
import QueryClientProvider from '@/providers/QueryClientProvider';
import '@/styles/index.css';

export const metadata: Metadata = {
    title: 'NavHigh Technologies — We Build What Moves Business',
    description:
        'AI-native products, scalable systems, and long-term engineering partnerships for ambitious companies. 150+ projects delivered. 98% client retention.',
};

const RootLayout: React.FC<React.PropsWithChildren<unknown>> = ({ children }) => {
    return (
        <html lang="en">
            <body className="antialiased">
                <QueryClientProvider>{children}</QueryClientProvider>
            </body>
        </html>
    );
};

export default RootLayout;
