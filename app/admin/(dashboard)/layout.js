import { getCurrentUser, getAdminUser } from '@/lib/supabase/auth';
import DashboardSidebar from './DashboardSidebar';

export default async function DashboardLayout({ children }) {
    // Fetch current user and admin data
    const { user } = await getCurrentUser();
    const { admin } = user ? await getAdminUser(user.id) : { admin: null };

    return (
        <div className="min-h-screen bg-gray-50">
            <DashboardSidebar currentUser={user} adminData={admin} />

            {/* Main Content */}
            <main className="lg:ml-64 pt-20 lg:pt-0 p-4 lg:p-8">
                {children}
            </main>
        </div>
    );
}
