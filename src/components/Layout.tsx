import Navbar from './Navbar';

interface LayoutProps {
    children: React.ReactNode;
}

const Layout: React.FC<LayoutProps> = ({ children }) => {
    return (
        <div className="min-h-screen flex flex-col text-gray-800">
            <Navbar />
            <main className="flex-grow pt-28">
                {children}
            </main>

            <footer className="bg-white border-t border-gray-100 py-8 mt-12">
                <div className="max-w-7xl mx-auto px-4 text-center text-gray-500 text-sm">
                    <p>© {new Date().getFullYear()} RetinaAI Check. Educational Use Only.</p>
                    <p className="mt-2 text-xs">
                        Disclaimer: This system provides preliminary screening and educational information.
                        It is not a substitute for professional medical diagnosis or treatment.
                        Always consult an ophthalmologist for eye health concerns.
                    </p>
                </div>
            </footer>
        </div>
    );
};

export default Layout;
