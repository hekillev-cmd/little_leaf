import { useState } from "react";
import { useLocation } from "wouter";
import { trpc } from "@/lib/trpc";

export default function AdminLogin() {
  const [password, setPassword] = useState("");
  const [, navigate] = useLocation();

  const loginMutation = trpc.admin.login.useMutation({
    onSuccess: () => {
      navigate("/settings");
    },
  });

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!password) return;
    loginMutation.mutate({ password });
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-gray-50 px-4">
      <div className="w-full max-w-sm bg-white rounded-lg shadow-md p-8">
        <h1 className="text-xl font-bold text-center mb-6">تسجيل دخول المدير</h1>
        <form onSubmit={handleSubmit} className="space-y-4">
          <input
            type="password"
            value={password}
            onChange={e => setPassword(e.target.value)}
            placeholder="كلمة السر"
            autoFocus
            className="w-full border rounded-md px-3 py-2 focus:outline-none focus:ring-2 focus:ring-blue-500"
          />
          {loginMutation.isError && (
            <p className="text-red-600 text-sm text-center">
              كلمة السر غير صحيحة
            </p>
          )}
          <button
            type="submit"
            disabled={loginMutation.isPending}
            className="w-full bg-blue-600 text-white rounded-md py-2 font-medium disabled:opacity-50"
          >
            {loginMutation.isPending ? "جاري الدخول..." : "دخول"}
          </button>
        </form>
      </div>
    </div>
  );
}