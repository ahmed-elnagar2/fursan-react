import { useState, useEffect } from "react";
import api from "@/lib/api";
import { Button } from "@/Components/ui/button";
import { Input } from "@/Components/ui/input";
import { Label } from "@/Components/ui/label";
import { toast } from "@/hooks/use-toast";
import { useLanguage } from "@/hooks/useLanguage";
import { Plus, Trash2, Key } from "lucide-react";
import AdminLoading from "./AdminLoading";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
  DialogFooter,
} from "@/Components/ui/dialog";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/Components/ui/table";

interface User {
  id: string | number;
  email: string;
  created_at: string;
  role: string;
}

const AdminUsers = () => {
  const [users, setUsers] = useState<User[]>([]);
  const [loading, setLoading] = useState(true);
  const [newEmail, setNewEmail] = useState("");
  const [newPassword, setNewPassword] = useState("");
  const [creatingUser, setCreatingUser] = useState(false);
  const [dialogOpen, setDialogOpen] = useState(false);
  const { t } = useLanguage();
  const [resetEmail, setResetEmail] = useState("");
  const [resetPassword, setResetPassword] = useState("");
  const [resetDialogOpen, setResetDialogOpen] = useState(false);
  const [newRole, setNewRole] = useState("admin");
  const [editingUser, setEditingUser] = useState<User | null>(null);
  const [editRoleDialogOpen, setEditRoleDialogOpen] = useState(false);
  const [updatedRole, setUpdatedRole] = useState("");

  useEffect(() => {
    fetchUsers();
  }, []);

  const fetchUsers = async () => {
    setLoading(true);
    try {
      const { data } = await api.get("/users");
      const usersList = data.map((user: any) => ({
        id: user.id,
        email: user.email,
        created_at: user.created_at,
        role: user.roles?.[0]?.role || "admin",
      }));
      setUsers(usersList);
    } catch (error: any) {
      console.error("Failed to fetch users:", error);
      toast({ 
        title: t("error"), 
        description: error.response?.data?.message || t("error_loading_users"), 
        variant: "destructive" 
      });
    } finally {
      setTimeout(() => setLoading(false), 800);
    }
  };

  const handleAddUser = async () => {
    if (!newEmail || !newPassword) {
      toast({ title: t("error"), description: t("fill_all_fields"), variant: "destructive" });
      return;
    }

    setCreatingUser(true);
    try {
      await api.post("/users", {
        name: newEmail.split('@')[0],
        email: newEmail,
        password: newPassword,
        role: newRole,
      });

      toast({ title: t("success"), description: t("user_added_successfully") });
      setNewEmail("");
      setNewPassword("");
      setNewRole("admin");
      setDialogOpen(false);
      await fetchUsers();
    } catch (error: any) {
      toast({ title: t("error"), description: error.response?.data?.message || t("failed_to_add_user"), variant: "destructive" });
    } finally {
      setCreatingUser(false);
    }
  };

  const handleResetPassword = async () => {
    if (!resetEmail || !resetPassword) {
      toast({ title: t("error"), description: t("fill_all_fields"), variant: "destructive" });
      return;
    }

    try {
      const user = users.find(u => u.email === resetEmail);
      if (!user) {
        toast({ title: t("error"), description: t("user_not_found"), variant: "destructive" });
        return;
      }

      await api.put(`/users/${user.id}/reset-password`, {
        password: resetPassword,
      });

      toast({ title: t("success"), description: t("password_updated_successfully") });
      setResetEmail("");
      setResetPassword("");
      setResetDialogOpen(false);
    } catch (error: any) {
      toast({ title: t("error"), description: error.response?.data?.message || t("failed_to_update_password"), variant: "destructive" });
    }
  };

  const handleUpdateRole = async () => {
    if (!editingUser || !updatedRole) return;

    try {
      await api.put(`/users/${editingUser.id}`, { role: updatedRole });
      toast({ title: t("success"), description: t("admin_users_role_updated") });
      setEditRoleDialogOpen(false);
      setEditingUser(null);
      await fetchUsers();
    } catch (error: any) {
      toast({ title: t("error"), description: error.response?.data?.message || t("failed_to_save"), variant: "destructive" });
    }
  };

  const handleDeleteUser = async (userId: string | number, email: string) => {
    if (!window.confirm(`${t("confirm_delete")} ${email}؟`)) {
      return;
    }

    try {
      await api.delete(`/users/${userId}`);
      toast({ title: t("success"), description: t("user_deleted_successfully") });
      await fetchUsers();
    } catch (error: any) {
      toast({ title: t("error"), description: error.response?.data?.message || t("failed_to_delete_user"), variant: "destructive" });
    }
  };

  if (loading) return <AdminLoading />;

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <h2 className="text-xl font-bold gradient-gold-text">{t("admin_users_title")}</h2>
        <div className="flex gap-2">
          <Dialog open={resetDialogOpen} onOpenChange={setResetDialogOpen}>
            <DialogTrigger asChild>
              <Button className="bg-blue-600 hover:bg-blue-700 text-white">
                <Key className="w-4 h-4 ml-2" /> {t("reset_password")}
              </Button>
            </DialogTrigger>
            <DialogContent>
              <DialogHeader>
                <DialogTitle>{t("reset_password")}</DialogTitle>
                <DialogDescription>
                  {t("select_user_and_new_password")}
                </DialogDescription>
              </DialogHeader>
              <div className="space-y-4">
                <div>
                  <Label htmlFor="reset-email">{t("admin_email")}</Label>
                  <Input
                    id="reset-email"
                    type="email"
                    value={resetEmail}
                    onChange={(e) => setResetEmail(e.target.value)}
                    placeholder={t("select_from_list")}
                    list="user-emails"
                    dir="ltr"
                  />
                  <datalist id="user-emails">
                    {users.map((user) => (
                      <option key={user.id} value={user.email} />
                    ))}
                  </datalist>
                </div>
                <div>
                  <Label htmlFor="reset-password">{t("new_password")}</Label>
                  <Input
                    id="reset-password"
                    type="password"
                    value={resetPassword}
                    onChange={(e) => setResetPassword(e.target.value)}
                    dir="ltr"
                  />
                </div>
                <Button onClick={handleResetPassword} className="w-full gradient-gold text-primary-foreground">
                  {t("reset_password")}
                </Button>
              </div>
            </DialogContent>
          </Dialog>

          <Dialog open={dialogOpen} onOpenChange={setDialogOpen}>
            <DialogTrigger asChild>
              <Button className="gradient-gold text-primary-foreground">
                <Plus className="w-4 h-4 ml-2" /> {t("admin_users_add_new")}
              </Button>
            </DialogTrigger>
            <DialogContent className="sm:max-w-md">
              <DialogHeader>
                <DialogTitle>{t("admin_users_add_new")}</DialogTitle>
                <DialogDescription>
                  {t("enter_new_user_details")}
                </DialogDescription>
              </DialogHeader>
              <div className="space-y-4 py-4">
                <div>
                  <Label htmlFor="email">{t("admin_email")}</Label>
                  <Input
                    id="email"
                    type="email"
                    value={newEmail}
                    onChange={(e) => setNewEmail(e.target.value)}
                    dir="ltr"
                  />
                </div>
                <div>
                  <Label htmlFor="password">{t("admin_password")}</Label>
                  <Input
                    id="password"
                    type="password"
                    value={newPassword}
                    onChange={(e) => setNewPassword(e.target.value)}
                    dir="ltr"
                  />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="role">{t("admin_users_role")}</Label>
                  <select
                    id="role"
                    value={newRole}
                    onChange={(e) => setNewRole(e.target.value)}
                    className="flex h-10 w-full rounded-md border border-input bg-background px-3 py-2 text-sm ring-offset-background placeholder:text-muted-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring disabled:cursor-not-allowed disabled:opacity-50"
                  >
                    <option value="admin">{t("role_admin")}</option>
                    <option value="services_manager">{t("role_services_manager")}</option>
                    <option value="messages_moderator">{t("role_messages_moderator")}</option>
                    <option value="operations_manager">{t("role_operations_manager")}</option>
                  </select>
                </div>
              </div>
              <DialogFooter>
                <Button
                  onClick={handleAddUser}
                  disabled={creatingUser}
                  className="w-full gradient-gold text-primary-foreground"
                >
                  {creatingUser ? t("saving") : t("admin_add")}
                </Button>
              </DialogFooter>
            </DialogContent>
          </Dialog>

          <Dialog open={editRoleDialogOpen} onOpenChange={setEditRoleDialogOpen}>
            <DialogContent className="sm:max-w-md">
              <DialogHeader>
                <DialogTitle>{t("role_edit")}</DialogTitle>
                <DialogDescription>
                  {editingUser?.email}
                </DialogDescription>
              </DialogHeader>
              <div className="space-y-4 py-4">
                <div className="space-y-2">
                  <Label htmlFor="edit-role">{t("admin_users_role")}</Label>
                  <select
                    id="edit-role"
                    value={updatedRole}
                    onChange={(e) => setUpdatedRole(e.target.value)}
                    className="flex h-10 w-full rounded-md border border-input bg-background px-3 py-2 text-sm ring-offset-background placeholder:text-muted-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring disabled:cursor-not-allowed disabled:opacity-50"
                  >
                    <option value="admin">{t("role_admin")}</option>
                    <option value="services_manager">{t("role_services_manager")}</option>
                    <option value="messages_moderator">{t("role_messages_moderator")}</option>
                    <option value="operations_manager">{t("role_operations_manager")}</option>
                  </select>
                </div>
              </div>
              <DialogFooter>
                <Button
                  onClick={handleUpdateRole}
                  className="w-full gradient-gold text-primary-foreground"
                >
                  {t("admin_save")}
                </Button>
              </DialogFooter>
            </DialogContent>
          </Dialog>
        </div>
      </div>

      <div className="border border-gold-light rounded-lg overflow-hidden">
        <Table>
          <TableHeader>
            <TableRow className="bg-muted/50 border-gold-medium/10">
              <TableHead className="text-start">{t("admin_email")}</TableHead>
              <TableHead className="text-start">{t("admin_users_role")}</TableHead>
              <TableHead className="text-start">{t("admin_users_created_at")}</TableHead>
              <TableHead className="text-center">{t("admin_actions")}</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {users.length === 0 ? (
              <TableRow>
                <TableCell colSpan={4} className="text-center text-muted-foreground py-8">
                  {t("no_users_found")}
                </TableCell>
              </TableRow>
            ) : (
              users.map((user) => (
                <TableRow key={user.id}>
                  <TableCell className="text-start font-medium">{user.email}</TableCell>
                  <TableCell className="text-start">
                    {t(`role_${user.role}`) || user.role}
                  </TableCell>
                  <TableCell className="text-start">
                    {user.created_at ? new Date(user.created_at).toLocaleDateString("ar-EG") : "---"}
                  </TableCell>
                  <TableCell className="text-center">
                    <div className="flex items-center justify-center gap-1">
                      <Button
                        variant="ghost"
                        size="sm"
                        onClick={() => {
                          setEditingUser(user);
                          setUpdatedRole(user.role);
                          setEditRoleDialogOpen(true);
                        }}
                        className="text-blue-600 hover:text-blue-700 hover:bg-blue-50 dark:hover:bg-blue-900/20"
                      >
                        {t("admin_edit")}
                      </Button>
                      <Button
                        variant="ghost"
                        size="sm"
                        onClick={() => handleDeleteUser(user.id, user.email)}
                        className="text-destructive hover:text-destructive hover:bg-destructive/10"
                      >
                        <Trash2 className="w-4 h-4" />
                      </Button>
                    </div>
                  </TableCell>
                </TableRow>
              ))
            )}
          </TableBody>
        </Table>
      </div>
    </div>
  );
};

export default AdminUsers;
