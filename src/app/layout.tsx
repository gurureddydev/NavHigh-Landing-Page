import type { Metadata } from 'next';
import QueryClientProvider from '@/providers/QueryClientProvider';
import '@/styles/index.css';

export const metadata: Metadata = {
    title: 'Lithos - Layers Hold Tales of Time',
    description:
        'Every layer of sediment records a chapter of our planet, from ancient seabeds to drifting ash, layered across millions of years beneath us.',
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
