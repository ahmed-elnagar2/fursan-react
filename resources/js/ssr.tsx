import { createInertiaApp } from '@inertiajs/react';
import createServer from '@inertiajs/react/server';
import { ThemeProvider } from '@/Components/ThemeProvider';
import { AuthProvider } from '@/hooks/useAuth';
import { LanguageProvider } from '@/hooks/useLanguage';
import { QueryClient, QueryClientProvider } from '@tanstack/react-query';
import { resolvePageComponent } from 'laravel-vite-plugin/inertia-helpers';
import ReactDOMServer from 'react-dom/server';
import { RouteName } from 'ziggy-js';
import { route } from '../../vendor/tightenco/ziggy';

const appName = import.meta.env.VITE_APP_NAME || 'Laravel';

createServer((page) =>
    createInertiaApp({
        page,
        render: ReactDOMServer.renderToString,
        title: (title) => `${title} - ${appName}`,
        resolve: (name) =>
            resolvePageComponent(
                `./Pages/${name}.tsx`,
                import.meta.glob('./Pages/**/*.tsx'),
            ),
        setup: ({ App, props }) => {
            const queryClient = new QueryClient();

            /* eslint-disable */
            // @ts-expect-error
            global.route = (name, params, absolute) =>
                route(name, params as any, absolute, {
                    ...page.props.ziggy,
                    location: new URL(page.props.ziggy.location),
                });
            /* eslint-enable */

            return (
                <ThemeProvider attribute="class" defaultTheme="system" enableSystem>
                    <QueryClientProvider client={queryClient}>
                        <LanguageProvider>
                            <AuthProvider>
                                <App {...props} />
                            </AuthProvider>
                        </LanguageProvider>
                    </QueryClientProvider>
                </ThemeProvider>
            );
        },
    }),
);
