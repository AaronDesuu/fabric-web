import { createClient } from '@/lib/supabase/server';
import { isSuperAdmin, getCurrentUser } from '@/lib/supabase/auth';
import { getShopSettings } from '@/lib/supabase/settings';
import AdminUserList from './AdminUserList';
import SettingsForm from './SettingsForm';

async function getAdminUsers() {
    const supabase = await createClient();

    const { data, error } = await supabase
        .from('admin_users')
        .select('*')
        .order('created_at', { ascending: false });

    if (error) {
        console.error('Error fetching admin users:', error);
        return [];
    }

    return data || [];
}

export default async function SettingsPage() {
    const { user } = await getCurrentUser();
    const isSuper = user ? await isSuperAdmin(user.id) : false;

    // Fetch parallel data
    const [adminUsers, { settings }] = await Promise.all([
        getAdminUsers(),
        getShopSettings()
    ]);

    return (
        <div>
            {/* Header */}
            <div className="mb-6">
                <h1 className="text-2xl sm:text-3xl font-bold text-gray-900">Settings</h1>
                <p className="text-gray-600 mt-1 text-sm sm:text-base">Manage shop configuration and admin access</p>
            </div>

            {/* Section 1: Shop Configuration */}
            <SettingsForm initialSettings={settings} />

            {/* Section 2: Admin Management */}
            <div className="bg-white rounded-xl shadow-sm border border-gray-100 p-6">
                <h2 className="text-lg font-bold text-gray-900 mb-4">Admin Management</h2>

                {!isSuper && (
                    <div className="bg-blue-50 border border-blue-200 rounded-lg p-4 mb-6">
                        <p className="text-sm text-blue-800">
                            Only super admins can add or remove admin users. Contact a super admin if you need to make changes.
                        </p>
                    </div>
                )}

                <AdminUserList
                    admins={adminUsers}
                    currentUserId={user?.id}
                    isSuperAdmin={isSuper}
                />
            </div>
        </div>
    );
}
