import '../css/app.css';
import './bootstrap';

import { createInertiaApp } from '@inertiajs/react';
import { Toaster } from '@/Components/ui/toaster';
import { ThemeProvider } from '@/Components/ThemeProvider';
import { AuthProvider } from '@/hooks/useAuth';
import { LanguageProvider } from '@/hooks/useLanguage';
import { QueryClient, QueryClientProvider } from '@tanstack/react-query';
import { resolvePageComponent } from 'laravel-vite-plugin/inertia-helpers';
import { createRoot, hydrateRoot } from 'react-dom/client';

const appName = import.meta.env.VITE_APP_NAME || 'Laravel';
const queryClient = new QueryClient();

createInertiaApp({
    title: (title) => `${title} - ${appName}`,
    resolve: (name) =>
        resolvePageComponent(
            `./Pages/${name}.tsx`,
            import.meta.glob('./Pages/**/*.tsx'),
        ),
    setup({ el, App, props }) {
        if (import.meta.env.SSR) {
            hydrateRoot(
                el,
                <ThemeProvider attribute="class" defaultTheme="system" enableSystem>
                    <QueryClientProvider client={queryClient}>
                        <LanguageProvider>
                            <AuthProvider>
                                <App {...props} />
                                <Toaster />
                            </AuthProvider>
                        </LanguageProvider>
                    </QueryClientProvider>
                </ThemeProvider>,
            );
            return;
        }

        createRoot(el).render(
            <ThemeProvider attribute="class" defaultTheme="system" enableSystem>
                <QueryClientProvider client={queryClient}>
                    <LanguageProvider>
                        <AuthProvider>
                            <App {...props} />
                            <Toaster />
                        </AuthProvider>
                    </LanguageProvider>
                </QueryClientProvider>
            </ThemeProvider>,
        );
    },
    progress: {
        color: '#4B5563',
    },
});
