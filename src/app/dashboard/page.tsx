
"use client";

import { useEffect, useState } from "react";
import Link from "next/link";

type User = {
  id: number;
  name: string;
  email: string;
  phone: string | null;
  role: string;
  xcoin: number;
  createdAt: string;
};

type Product = {
  id: number;
  name: string;
  description: string | null;
  price: number;
  xcoinPrice: number;
  image: string | null;
  stock: number;
};

type OrderStatus =
  | "PENDING"
  | "CONFIRMED"
  | "PROCESSING"
  | "SHIPPED"
  | "DELIVERED"
  | "CANCELLED";

type OrderItem = {
  id: number;
  orderId: number;
  productId: number;
  productName: string;
  price: number;
  quantity: number;
};

type OrderUser = {
  id: number;
  name: string;
  email: string;
  phone: string | null;
};

type Order = {
  id: number;
  userId: number;
  subtotal: number;
  shipping: number;
  total: number;
  status: OrderStatus;
  phone: string;
  address: string;
  createdAt: string;
  updatedAt: string;
  user: OrderUser;
  items: OrderItem[];
};

type Section = "overview" | "users" | "products" | "orders";

const statusLabels: Record<OrderStatus, string> = {
  PENDING: "في انتظار التأكيد",
  CONFIRMED: "تم تأكيد الطلب",
  PROCESSING: "جاري التجهيز",
  SHIPPED: "تم الشحن",
  DELIVERED: "تم التسليم",
  CANCELLED: "تم الإلغاء",
};

const statusClasses: Record<OrderStatus, string> = {
  PENDING: "bg-yellow-100 text-yellow-700",
  CONFIRMED: "bg-blue-100 text-blue-700",
  PROCESSING: "bg-purple-100 text-purple-700",
  SHIPPED: "bg-indigo-100 text-indigo-700",
  DELIVERED: "bg-green-100 text-green-700",
  CANCELLED: "bg-red-100 text-red-700",
};

export default function DashboardPage() {
  const [section, setSection] = useState<Section>("overview");
  const [uploadingImage, setUploadingImage] = useState(false);
  

  const [users, setUsers] = useState<User[]>([]);
  const [products, setProducts] = useState<Product[]>([]);
  const [orders, setOrders] = useState<Order[]>([]);

  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  const [selectedUser, setSelectedUser] = useState<User | null>(null);
  const [selectedOrder, setSelectedOrder] = useState<Order | null>(null);

  const [showUserModal, setShowUserModal] = useState(false);
  const [showOrderModal, setShowOrderModal] = useState(false);

  const [editingUser, setEditingUser] = useState(false);

  const [userForm, setUserForm] = useState({
    name: "",
    email: "",
    phone: "",
  });

  const [xcoinAmount, setXcoinAmount] = useState("");

  const [productForm, setProductForm] = useState({
    name: "",
    description: "",
    price: "",
    xcoinPrice: "",
    image: "",
    stock: "",
  });
async function handleImageUpload(
  e: React.ChangeEvent<HTMLInputElement>
) {
  const file = e.target.files?.[0];

  if (!file) return;

  try {
    setUploadingImage(true);

    const formData = new FormData();
    formData.append("file", file);

    const response = await fetch("/api/upload", {
      method: "POST",
      body: formData,
    });

    const data = await response.json();

    if (!response.ok) {
      alert(data.error || "فشل رفع الصورة");
      return;
    }

    setProductForm((prev) => ({
      ...prev,
      image: data.url,
    }));
  } catch {
    alert("حدث خطأ أثناء رفع الصورة");
  } finally {
    setUploadingImage(false);
  }
}
  const [editingProduct, setEditingProduct] = useState<Product | null>(null);
  const [showProductModal, setShowProductModal] = useState(false);

  const [saving, setSaving] = useState(false);

  const fetchDashboardData = async () => {
    try {
      setLoading(true);
      setError("");

      const [usersRes, productsRes, ordersRes] = await Promise.all([
        fetch("/api/admin/users"),
        fetch("/api/products"),
        fetch("/api/admin/orders"),
      ]);

      if (usersRes.status === 403 || ordersRes.status === 403) {
        setError("غير مصرح لك بالوصول إلى لوحة التحكم");
        return;
      }

      const usersData = await usersRes.json();
      const productsData = await productsRes.json();
      const ordersData = await ordersRes.json();

      if (!usersRes.ok) {
        throw new Error(usersData.error || "حدث خطأ أثناء جلب المستخدمين");
      }

      if (!productsRes.ok) {
        throw new Error(
          productsData.error || "حدث خطأ أثناء جلب المنتجات",
        );
      }

      if (!ordersRes.ok) {
        throw new Error(ordersData.error || "حدث خطأ أثناء جلب الطلبات");
      }

      setUsers(usersData.users || []);
      setProducts(productsData.products || productsData || []);
      setOrders(ordersData.orders || []);
    } catch (err) {
      setError(
        err instanceof Error
          ? err.message
          : "حدث خطأ أثناء تحميل بيانات لوحة التحكم",
      );
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchDashboardData();
  }, []);

  const formatDate = (date: string) => {
    return new Intl.DateTimeFormat("ar-EG", {
      year: "numeric",
      month: "short",
      day: "numeric",
    }).format(new Date(date));
  };

  const formatPrice = (price: number) => {
    return `${price.toLocaleString("ar-EG")} ج.م`;
  };

  // =========================
  // USERS
  // =========================

  const openUserModal = (user: User) => {
    setSelectedUser(user);
    setUserForm({
      name: user.name,
      email: user.email,
      phone: user.phone || "",
    });
    setXcoinAmount("");
    setEditingUser(false);
    setShowUserModal(true);
  };

  const updateUser = async () => {
    if (!selectedUser) return;

    if (!userForm.name.trim()) {
      alert("اكتب اسم المستخدم");
      return;
    }

    if (!userForm.email.trim()) {
      alert("اكتب البريد الإلكتروني");
      return;
    }

    try {
      setSaving(true);

      const res = await fetch(`/api/admin/users/${selectedUser.id}`, {
        method: "PUT",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          name: userForm.name,
          email: userForm.email,
          phone: userForm.phone,
        }),
      });

      const data = await res.json();

      if (!res.ok) {
        throw new Error(data.error || "فشل تحديث المستخدم");
      }

      setUsers((prev) =>
        prev.map((user) =>
          user.id === selectedUser.id ? data.user : user,
        ),
      );

      setSelectedUser(data.user);
      setEditingUser(false);

      alert("تم تحديث بيانات المستخدم بنجاح");
    } catch (err) {
      alert(
        err instanceof Error ? err.message : "حدث خطأ أثناء تحديث المستخدم",
      );
    } finally {
      setSaving(false);
    }
  };

  const updateXcoin = async (action: "add" | "remove") => {
    if (!selectedUser) return;

    const amount = Number(xcoinAmount);

    if (!amount || amount <= 0) {
      alert("اكتب قيمة صحيحة");
      return;
    }

    if (action === "remove" && amount > selectedUser.xcoin) {
      alert("رصيد XCoin غير كافي");
      return;
    }

    try {
      setSaving(true);

      const res = await fetch(`/api/admin/users/${selectedUser.id}`, {
        method: "PATCH",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          xcoinAction: action,
          amount,
        }),
      });

      const data = await res.json();

      if (!res.ok) {
        throw new Error(data.error || "فشل تعديل XCoin");
      }

      setUsers((prev) =>
        prev.map((user) =>
          user.id === selectedUser.id ? data.user : user,
        ),
      );

      setSelectedUser(data.user);
      setXcoinAmount("");

      alert(
        action === "add"
          ? "تم إضافة XCoin بنجاح"
          : "تم خصم XCoin بنجاح",
      );
    } catch (err) {
      alert(
        err instanceof Error ? err.message : "حدث خطأ أثناء تعديل XCoin",
      );
    } finally {
      setSaving(false);
    }
  };

  const deleteUser = async (user: User) => {
    if (user.role === "ADMIN") {
      alert("لا يمكن حذف حساب الأدمن");
      return;
    }

    const confirmed = confirm(
      `هل أنت متأكد من حذف المستخدم "${user.name}"؟`,
    );

    if (!confirmed) return;

    try {
      setSaving(true);

      const res = await fetch(`/api/admin/users/${user.id}`, {
        method: "DELETE",
      });

      const data = await res.json();

      if (!res.ok) {
        throw new Error(data.error || "فشل حذف المستخدم");
      }

      setUsers((prev) => prev.filter((item) => item.id !== user.id));

      if (selectedUser?.id === user.id) {
        setSelectedUser(null);
        setShowUserModal(false);
      }

      alert("تم حذف المستخدم بنجاح");
    } catch (err) {
      alert(
        err instanceof Error ? err.message : "حدث خطأ أثناء حذف المستخدم",
      );
    } finally {
      setSaving(false);
    }
  };

  // =========================
  // PRODUCTS
  // =========================

  const openAddProduct = () => {
    setEditingProduct(null);

    setProductForm({
      name: "",
      description: "",
      price: "",
      xcoinPrice: "",
      image: "",
      stock: "",
    });

    setShowProductModal(true);
  };

  const openEditProduct = (product: Product) => {
    setEditingProduct(product);

    setProductForm({
      name: product.name,
      description: product.description || "",
      price: String(product.price),
      xcoinPrice: String(product.xcoinPrice),
      image: product.image || "",
      stock: String(product.stock),
    });

    setShowProductModal(true);
  };

const saveProduct = async () => {
  if (!productForm.name.trim()) {
    alert("اكتب اسم المنتج");
    return;
  }

  if (!productForm.price || Number(productForm.price) < 0) {
    alert("اكتب سعر صحيح");
    return;
  }

  if (
    !productForm.xcoinPrice ||
    Number(productForm.xcoinPrice) < 0
  ) {
    alert("اكتب سعر XCoin صحيح");
    return;
  }

  try {
    setSaving(true);

    const body = {
      name: productForm.name,
      description: productForm.description,
      price: Number(productForm.price),
      xcoinPrice: Number(productForm.xcoinPrice),
      image: productForm.image || null,
      stock: Number(productForm.stock || 0),
    };

    const url = editingProduct
      ? `/api/products/${editingProduct.id}`
      : "/api/products";

    const method = editingProduct ? "PUT" : "POST";

    const res = await fetch(url, {
      method,
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify(body),
    });

    const data = await res.json();

    if (!res.ok) {
      throw new Error(data.error || "فشل حفظ المنتج");
    }

    if (editingProduct) {
      setProducts((prev) =>
        prev.map((product) =>
          product.id === editingProduct.id ? data : product,
        ),
      );
    } else {
      setProducts((prev) => [data, ...prev]);
    }

    setShowProductModal(false);

    alert(
      editingProduct
        ? "تم تعديل المنتج بنجاح"
        : "تم إضافة المنتج بنجاح",
    );
  } catch (err) {
    alert(
      err instanceof Error
        ? err.message
        : "حدث خطأ أثناء حفظ المنتج",
    );
  } finally {
    setSaving(false);
  }
};
  const deleteProduct = async (product: Product) => {
    const confirmed = confirm(
      `هل أنت متأكد من حذف المنتج "${product.name}"؟`,
    );

    if (!confirmed) return;

    try {
      setSaving(true);

      const res = await fetch(`/api/products/${product.id}`, {
        method: "DELETE",
      });

      const data = await res.json();

      if (!res.ok) {
        throw new Error(data.error || "فشل حذف المنتج");
      }

      setProducts((prev) =>
        prev.filter((item) => item.id !== product.id),
      );

      alert("تم حذف المنتج بنجاح");
    } catch (err) {
      alert(
        err instanceof Error ? err.message : "حدث خطأ أثناء حذف المنتج",
      );
    } finally {
      setSaving(false);
    }
  };

  // =========================
  // ORDERS
  // =========================

  const openOrderModal = (order: Order) => {
    setSelectedOrder(order);
    setShowOrderModal(true);
  };

  const updateOrderStatus = async (
    order: Order,
    status: OrderStatus,
  ) => {
    try {
      setSaving(true);

      const res = await fetch("/api/admin/orders", {
        method: "PATCH",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          orderId: order.id,
          status,
        }),
      });

      const data = await res.json();

      if (!res.ok) {
        throw new Error(data.error || "فشل تحديث حالة الطلب");
      }

      setOrders((prev) =>
        prev.map((item) =>
          item.id === order.id
            ? {
                ...item,
                status,
                updatedAt: data.order?.updatedAt || item.updatedAt,
              }
            : item,
        ),
      );

      if (selectedOrder?.id === order.id) {
        setSelectedOrder({
          ...selectedOrder,
          status,
          updatedAt: data.order?.updatedAt || selectedOrder.updatedAt,
        });
      }

      alert("تم تحديث حالة الطلب بنجاح");
    } catch (err) {
      alert(
        err instanceof Error
          ? err.message
          : "حدث خطأ أثناء تحديث الطلب",
      );
    } finally {
      setSaving(false);
    }
  };

  const cancelOrder = async (order: Order) => {
    const confirmed = confirm(
      `هل أنت متأكد من إلغاء الطلب #${order.id}؟`,
    );

    if (!confirmed) return;

    await updateOrderStatus(order, "CANCELLED");
  };

  // =========================
  // LOGOUT
  // =========================

  const logout = async () => {
    try {
      await fetch("/api/auth/logout", {
        method: "POST",
      });
    } finally {
      window.location.href = "/login";
    }
  };

  // =========================
  // SIDEBAR
  // =========================

  const sidebarItems: {
    id: Section;
    label: string;
    icon: string;
  }[] = [
    {
      id: "overview",
      label: "الرئيسية",
      icon: "📊",
    },
    {
      id: "users",
      label: "المستخدمين",
      icon: "👥",
    },
    {
      id: "products",
      label: "المنتجات",
      icon: "🍯",
    },
    {
      id: "orders",
      label: "الطلبات",
      icon: "📦",
    },
  ];

  if (loading) {
    return (
      <main
        dir="rtl"
        className="min-h-screen bg-[#fffdf7] flex items-center justify-center"
      >
        <div className="text-center">
          <div className="w-12 h-12 border-4 border-[#174c32]/20 border-t-[#174c32] rounded-full animate-spin mx-auto mb-4" />
          <p className="font-bold text-[#174c32]">
            جاري تحميل لوحة التحكم...
          </p>
        </div>
      </main>
    );
  }

  if (error) {
    return (
      <main
        dir="rtl"
        className="min-h-screen bg-[#fffdf7] flex items-center justify-center px-5"
      >
        <div className="w-full max-w-md bg-white rounded-[28px] p-8 shadow-lg border border-red-100 text-center">
          <div className="text-5xl mb-5">🔒</div>

          <h1 className="text-2xl font-black text-[#174c32] mb-3">
            لا يمكن فتح لوحة التحكم
          </h1>

          <p className="text-gray-600 mb-6">{error}</p>

          <div className="flex gap-3 justify-center">
            <button
              onClick={fetchDashboardData}
              className="bg-[#174c32] text-white px-5 py-3 rounded-xl font-bold hover:bg-[#103b27] transition"
            >
              إعادة المحاولة
            </button>

            <Link
              href="/"
              className="bg-gray-100 text-gray-700 px-5 py-3 rounded-xl font-bold no-underline"
            >
              الرئيسية
            </Link>
          </div>
        </div>
      </main>
    );
  }

  return (
    <main
      dir="rtl"
      className="min-h-screen bg-[#fffdf7] text-gray-800"
    >
      {/* ================= HEADER ================= */}

      <header className="bg-[#174c32] text-white px-5 lg:px-8 py-4 sticky top-0 z-40 shadow-md">
        <div className="max-w-7xl mx-auto flex items-center justify-between gap-4">
          <div>
            <h1 className="text-xl md:text-2xl font-black">
              لوحة تحكم التمساح 🐊
            </h1>

            <p className="text-white/70 text-xs md:text-sm mt-1">
              إدارة المستخدمين والمنتجات والطلبات
            </p>
          </div>

          <div className="flex items-center gap-2">
            <button
              onClick={fetchDashboardData}
              className="bg-white/10 hover:bg-white/20 px-3 py-2 rounded-xl text-sm font-bold transition"
            >
              🔄 تحديث
            </button>

            <Link
              href="/"
              className="hidden md:block bg-white/10 hover:bg-white/20 px-4 py-2 rounded-xl text-sm font-bold no-underline text-white transition"
            >
              الموقع
            </Link>

            <button
              onClick={logout}
              className="bg-red-500/90 hover:bg-red-600 px-4 py-2 rounded-xl text-sm font-bold transition"
            >
              خروج
            </button>
          </div>
        </div>
      </header>

      <div className="max-w-7xl mx-auto px-4 lg:px-8 py-6">
        <div className="grid lg:grid-cols-[230px_1fr] gap-6">
          {/* ================= SIDEBAR ================= */}

          <aside className="bg-white rounded-[28px] border border-gray-100 shadow-sm p-3 h-fit lg:sticky lg:top-24">
            <div className="space-y-2">
              {sidebarItems.map((item) => (
                <button
                  key={item.id}
                  onClick={() => setSection(item.id)}
                  className={`w-full flex items-center gap-3 px-4 py-3 rounded-2xl font-bold text-sm transition ${
                    section === item.id
                      ? "bg-[#174c32] text-white"
                      : "text-gray-600 hover:bg-[#f7f3e7]"
                  }`}
                >
                  <span className="text-lg">{item.icon}</span>
                  <span>{item.label}</span>
                </button>
              ))}
            </div>

            <div className="border-t border-gray-100 mt-4 pt-4">
              <div className="bg-[#fff4d2] rounded-2xl p-4">
                <p className="text-xs text-gray-500 mb-1">
                  تاريخ اليوم
                </p>

                <p className="font-black text-[#174c32]">
                  {new Intl.DateTimeFormat("ar-EG", {
                    year: "numeric",
                    month: "long",
                    day: "numeric",
                  }).format(new Date())}
                </p>
              </div>
            </div>
          </aside>

          {/* ================= CONTENT ================= */}

          <section className="min-w-0">
            {/* OVERVIEW */}

            {section === "overview" && (
              <div className="space-y-6">
                <div>
                  <h2 className="text-2xl md:text-3xl font-black text-[#174c32]">
                    الرئيسية
                  </h2>

                  <p className="text-gray-500 mt-1">
                    نظرة سريعة على المتجر
                  </p>
                </div>

                <div className="grid sm:grid-cols-2 xl:grid-cols-4 gap-4">
                  <StatCard
                    icon="👥"
                    title="المستخدمين"
                    value={users.length}
                    onClick={() => setSection("users")}
                  />

                  <StatCard
                    icon="🍯"
                    title="المنتجات"
                    value={products.length}
                    onClick={() => setSection("products")}
                  />

                  <StatCard
                    icon="📦"
                    title="الطلبات"
                    value={orders.length}
                    onClick={() => setSection("orders")}
                  />

                  <StatCard
                    icon="⏳"
                    title="طلبات معلقة"
                    value={
                      orders.filter(
                        (order) => order.status === "PENDING",
                      ).length
                    }
                    onClick={() => setSection("orders")}
                  />
                </div>

                <div className="grid xl:grid-cols-2 gap-6">
                  {/* Latest Orders */}

                  <div className="bg-white rounded-[28px] border border-gray-100 shadow-sm overflow-hidden">
                    <div className="p-5 border-b border-gray-100 flex items-center justify-between">
                      <div>
                        <h3 className="font-black text-lg text-[#174c32]">
                          أحدث الطلبات
                        </h3>

                        <p className="text-gray-500 text-sm mt-1">
                          آخر الطلبات المسجلة
                        </p>
                      </div>

                      <button
                        onClick={() => setSection("orders")}
                        className="text-[#174c32] font-bold text-sm"
                      >
                        عرض الكل
                      </button>
                    </div>

                    <div className="divide-y divide-gray-100">
                      {orders.length === 0 ? (
                        <EmptyState text="لا توجد طلبات حتى الآن" />
                      ) : (
                        orders.slice(0, 5).map((order) => (
                          <button
                            key={order.id}
                            onClick={() => openOrderModal(order)}
                            className="w-full text-right p-5 hover:bg-[#fffdf7] transition"
                          >
                            <div className="flex items-center justify-between gap-4">
                              <div>
                                <p className="font-black">
                                  #{order.id} -{" "}
                                  {order.user?.name || "مستخدم"}
                                </p>

                                <p className="text-sm text-gray-500 mt-1">
                                  {formatDate(order.createdAt)}
                                </p>
                              </div>

                              <div className="text-left">
                                <p className="font-black text-[#174c32]">
                                  {formatPrice(order.total)}
                                </p>

                                <span
                                  className={`inline-block mt-1 px-2 py-1 rounded-lg text-xs font-bold ${
                                    statusClasses[order.status]
                                  }`}
                                >
                                  {statusLabels[order.status]}
                                </span>
                              </div>
                            </div>
                          </button>
                        ))
                      )}
                    </div>
                  </div>

                  {/* Latest Users */}

                  <div className="bg-white rounded-[28px] border border-gray-100 shadow-sm overflow-hidden">
                    <div className="p-5 border-b border-gray-100 flex items-center justify-between">
                      <div>
                        <h3 className="font-black text-lg text-[#174c32]">
                          أحدث المستخدمين
                        </h3>

                        <p className="text-gray-500 text-sm mt-1">
                          المستخدمين المسجلين حديثًا
                        </p>
                      </div>

                      <button
                        onClick={() => setSection("users")}
                        className="text-[#174c32] font-bold text-sm"
                      >
                        عرض الكل
                      </button>
                    </div>

                    <div className="divide-y divide-gray-100">
                      {users.length === 0 ? (
                        <EmptyState text="لا يوجد مستخدمين" />
                      ) : (
                        users.slice(0, 5).map((user) => (
                          <button
                            key={user.id}
                            onClick={() => openUserModal(user)}
                            className="w-full text-right p-5 hover:bg-[#fffdf7] transition"
                          >
                            <div className="flex items-center gap-3">
                              <div className="w-11 h-11 rounded-full bg-[#174c32] text-white flex items-center justify-center font-black">
                                {user.name?.charAt(0)?.toUpperCase() ||
                                  "U"}
                              </div>

                              <div className="min-w-0">
                                <p className="font-black truncate">
                                  {user.name}
                                </p>

                                <p className="text-sm text-gray-500 truncate">
                                  {user.email}
                                </p>
                              </div>

                              <div className="mr-auto text-left">
                                <p className="text-sm font-bold text-[#174c32]">
                                  {user.xcoin} XCoin
                                </p>
                              </div>
                            </div>
                          </button>
                        ))
                      )}
                    </div>
                  </div>
                </div>
              </div>
            )}

            {/* USERS */}

            {section === "users" && (
              <div className="space-y-6">
                <div className="flex items-center justify-between gap-4">
                  <div>
                    <h2 className="text-2xl md:text-3xl font-black text-[#174c32]">
                      المستخدمين
                    </h2>

                    <p className="text-gray-500 mt-1">
                      إدارة حسابات المستخدمين
                    </p>
                  </div>
                </div>

                <div className="bg-white rounded-[28px] border border-gray-100 shadow-sm overflow-hidden">
                  <div className="overflow-x-auto">
                    <table className="w-full min-w-[800px]">
                      <thead className="bg-[#f7f3e7]">
                        <tr>
                          <th className="text-right p-4 text-sm font-black">
                            المستخدم
                          </th>

                          <th className="text-right p-4 text-sm font-black">
                            الهاتف
                          </th>

                          <th className="text-right p-4 text-sm font-black">
                            الدور
                          </th>

                          <th className="text-right p-4 text-sm font-black">
                            XCoin
                          </th>

                          <th className="text-right p-4 text-sm font-black">
                            التسجيل
                          </th>

                          <th className="text-right p-4 text-sm font-black">
                            الإجراءات
                          </th>
                        </tr>
                      </thead>

                      <tbody className="divide-y divide-gray-100">
                        {users.map((user) => (
                          <tr
                            key={user.id}
                            className="hover:bg-[#fffdf7] transition"
                          >
                            <td className="p-4">
                              <div className="flex items-center gap-3">
                                <div className="w-10 h-10 rounded-full bg-[#174c32] text-white flex items-center justify-center font-black">
                                  {user.name?.charAt(0)?.toUpperCase() ||
                                    "U"}
                                </div>

                                <div>
                                  <p className="font-black">
                                    {user.name}
                                  </p>

                                  <p className="text-xs text-gray-500">
                                    {user.email}
                                  </p>
                                </div>
                              </div>
                            </td>

                            <td className="p-4 text-sm">
                              {user.phone || "-"}
                            </td>

                            <td className="p-4">
                              <span
                                className={`px-3 py-1 rounded-lg text-xs font-bold ${
                                  user.role === "ADMIN"
                                    ? "bg-[#174c32] text-white"
                                    : "bg-gray-100 text-gray-600"
                                }`}
                              >
                                {user.role === "ADMIN"
                                  ? "أدمن"
                                  : "مستخدم"}
                              </span>
                            </td>

                            <td className="p-4">
                              <span className="font-black text-[#174c32]">
                                {user.xcoin} XCoin
                              </span>
                            </td>

                            <td className="p-4 text-sm text-gray-500">
                              {formatDate(user.createdAt)}
                            </td>

                            <td className="p-4">
                              <button
                                onClick={() => openUserModal(user)}
                                className="bg-[#174c32] text-white px-4 py-2 rounded-xl text-sm font-bold hover:bg-[#103b27] transition"
                              >
                                التفاصيل
                              </button>
                            </td>
                          </tr>
                        ))}
                      </tbody>
                    </table>
                  </div>

                  {users.length === 0 && (
                    <EmptyState text="لا يوجد مستخدمين حتى الآن" />
                  )}
                </div>
              </div>
            )}

            {/* PRODUCTS */}

            {section === "products" && (
              <div className="space-y-6">
                <div className="flex items-center justify-between gap-4">
                  <div>
                    <h2 className="text-2xl md:text-3xl font-black text-[#174c32]">
                      المنتجات
                    </h2>

                    <p className="text-gray-500 mt-1">
                      إدارة منتجات المتجر
                    </p>
                  </div>

                  <button
                    onClick={openAddProduct}
                    className="bg-[#174c32] text-white px-5 py-3 rounded-xl font-bold hover:bg-[#103b27] transition"
                  >
                    + إضافة منتج
                  </button>
                </div>

                <div className="grid sm:grid-cols-2 xl:grid-cols-3 gap-5">
                  {products.map((product) => (
                    <div
                      key={product.id}
                      className="bg-white rounded-[28px] border border-gray-100 shadow-sm overflow-hidden"
                    >
                      <div className="h-48 bg-[#f7f3e7] flex items-center justify-center overflow-hidden">
                        {product.image ? (
                          <img
                            src={product.image}
                            alt={product.name}
                            className="w-full h-full object-cover"
                          />
                        ) : (
                          <span className="text-6xl">🍯</span>
                        )}
                      </div>

                      <div className="p-5">
                        <h3 className="font-black text-lg text-[#174c32]">
                          {product.name}
                        </h3>

                        {product.description && (
                          <p className="text-sm text-gray-500 mt-2 line-clamp-2">
                            {product.description}
                          </p>
                        )}

                        <div className="grid grid-cols-2 gap-2 mt-4">
                          <div className="bg-[#fff4d2] rounded-xl p-3">
                            <p className="text-xs text-gray-500">
                              السعر
                            </p>

                            <p className="font-black text-[#174c32]">
                              {formatPrice(product.price)}
                            </p>
                          </div>

                          <div className="bg-[#f7f3e7] rounded-xl p-3">
                            <p className="text-xs text-gray-500">
                              المخزون
                            </p>

                            <p className="font-black">
                              {product.stock}
                            </p>
                          </div>
                        </div>

                        <div className="flex gap-2 mt-4">
                          <button
                            onClick={() => openEditProduct(product)}
                            className="flex-1 bg-[#174c32] text-white py-2.5 rounded-xl font-bold text-sm hover:bg-[#103b27] transition"
                          >
                            تعديل
                          </button>

                          <button
                            onClick={() => deleteProduct(product)}
                            className="bg-red-50 text-red-600 px-4 py-2.5 rounded-xl font-bold text-sm hover:bg-red-100 transition"
                          >
                            حذف
                          </button>
                        </div>
                      </div>
                    </div>
                  ))}
                </div>

                {products.length === 0 && (
                  <EmptyState text="لا توجد منتجات حتى الآن" />
                )}
              </div>
            )}

            {/* ORDERS */}

            {section === "orders" && (
              <div className="space-y-6">
                <div>
                  <h2 className="text-2xl md:text-3xl font-black text-[#174c32]">
                    الطلبات
                  </h2>

                  <p className="text-gray-500 mt-1">
                    إدارة ومتابعة طلبات العملاء
                  </p>
                </div>

                <div className="bg-white rounded-[28px] border border-gray-100 shadow-sm overflow-hidden">
                  <div className="overflow-x-auto">
                    <table className="w-full min-w-[950px]">
                      <thead className="bg-[#f7f3e7]">
                        <tr>
                          <th className="text-right p-4 font-black text-sm">
                            الطلب
                          </th>

                          <th className="text-right p-4 font-black text-sm">
                            العميل
                          </th>

                          <th className="text-right p-4 font-black text-sm">
                            الإجمالي
                          </th>

                          <th className="text-right p-4 font-black text-sm">
                            الحالة
                          </th>

                          <th className="text-right p-4 font-black text-sm">
                            التاريخ
                          </th>

                          <th className="text-right p-4 font-black text-sm">
                            الإجراءات
                          </th>
                        </tr>
                      </thead>

                      <tbody className="divide-y divide-gray-100">
                        {orders.map((order) => (
                          <tr
                            key={order.id}
                            className="hover:bg-[#fffdf7] transition"
                          >
                            <td className="p-4">
                              <span className="font-black text-[#174c32]">
                                #{order.id}
                              </span>
                            </td>

                            <td className="p-4">
                              <div>
                                <p className="font-black">
                                  {order.user?.name || "مستخدم"}
                                </p>

                                <p className="text-xs text-gray-500">
                                  {order.user?.phone ||
                                    order.phone ||
                                    "-"}
                                </p>
                              </div>
                            </td>

                            <td className="p-4 font-black">
                              {formatPrice(order.total)}
                            </td>

                            <td className="p-4">
                              <select
                                value={order.status}
                                onChange={(e) =>
                                  updateOrderStatus(
                                    order,
                                    e.target.value as OrderStatus,
                                  )
                                }
                                className={`border-0 outline-none px-3 py-2 rounded-xl font-bold text-xs ${
                                  statusClasses[order.status]
                                }`}
                              >
                                <option value="PENDING">
                                  في انتظار التأكيد
                                </option>

                                <option value="CONFIRMED">
                                  تم تأكيد الطلب
                                </option>

                                <option value="PROCESSING">
                                  جاري التجهيز
                                </option>

                                <option value="SHIPPED">
                                  تم الشحن
                                </option>

                                <option value="DELIVERED">
                                  تم التسليم
                                </option>

                                <option value="CANCELLED">
                                  تم الإلغاء
                                </option>
                              </select>
                            </td>

                            <td className="p-4 text-sm text-gray-500">
                              {formatDate(order.createdAt)}
                            </td>

                            <td className="p-4">
                              <div className="flex gap-2">
                                <button
                                  onClick={() =>
                                    openOrderModal(order)
                                  }
                                  className="bg-[#174c32] text-white px-3 py-2 rounded-xl text-xs font-bold"
                                >
                                  التفاصيل
                                </button>

                                {order.status !== "CANCELLED" &&
                                  order.status !== "DELIVERED" && (
                                    <button
                                      onClick={() =>
                                        cancelOrder(order)
                                      }
                                      className="bg-red-50 text-red-600 px-3 py-2 rounded-xl text-xs font-bold"
                                    >
                                      إلغاء
                                    </button>
                                  )}
                              </div>
                            </td>
                          </tr>
                        ))}
                      </tbody>
                    </table>
                  </div>

                  {orders.length === 0 && (
                    <EmptyState text="لا توجد طلبات حتى الآن" />
                  )}
                </div>
              </div>
            )}
          </section>
        </div>
      </div>

      {/* ================= USER MODAL ================= */}

      {showUserModal && selectedUser && (
        <Modal
          title={`بيانات المستخدم - ${selectedUser.name}`}
          onClose={() => setShowUserModal(false)}
        >
          <div className="space-y-5">
            <div className="flex items-center gap-4 bg-[#f7f3e7] rounded-2xl p-4">
              <div className="w-14 h-14 rounded-full bg-[#174c32] text-white flex items-center justify-center text-xl font-black">
                {selectedUser.name?.charAt(0)?.toUpperCase() ||
                  "U"}
              </div>

              <div>
                <h3 className="font-black text-lg">
                  {selectedUser.name}
                </h3>

                <p className="text-sm text-gray-500">
                  {selectedUser.email}
                </p>
              </div>
            </div>

            {editingUser ? (
              <div className="space-y-4">
                <Input
                  label="الاسم"
                  value={userForm.name}
                  onChange={(value) =>
                    setUserForm((prev) => ({
                      ...prev,
                      name: value,
                    }))
                  }
                />

                <Input
                  label="البريد الإلكتروني"
                  type="email"
                  value={userForm.email}
                  onChange={(value) =>
                    setUserForm((prev) => ({
                      ...prev,
                      email: value,
                    }))
                  }
                />

                <Input
                  label="رقم الهاتف"
                  value={userForm.phone}
                  onChange={(value) =>
                    setUserForm((prev) => ({
                      ...prev,
                      phone: value,
                    }))
                  }
                />

                <div className="flex gap-2">
                  <button
                    disabled={saving}
                    onClick={updateUser}
                    className="flex-1 bg-[#174c32] text-white py-3 rounded-xl font-bold disabled:opacity-50"
                  >
                    {saving ? "جاري الحفظ..." : "حفظ التعديلات"}
                  </button>

                  <button
                    onClick={() => setEditingUser(false)}
                    className="px-5 bg-gray-100 rounded-xl font-bold"
                  >
                    إلغاء
                  </button>
                </div>
              </div>
            ) : (
              <>
                <div className="grid sm:grid-cols-2 gap-3">
                  <InfoBox
                    label="البريد الإلكتروني"
                    value={selectedUser.email}
                  />

                  <InfoBox
                    label="الهاتف"
                    value={selectedUser.phone || "-"}
                  />

                  <InfoBox
                    label="الدور"
                    value={
                      selectedUser.role === "ADMIN"
                        ? "أدمن"
                        : "مستخدم"
                    }
                  />

                  <InfoBox
                    label="XCoin"
                    value={`${selectedUser.xcoin} XCoin`}
                  />

                  <InfoBox
                    label="تاريخ التسجيل"
                    value={formatDate(selectedUser.createdAt)}
                  />
                </div>

                <div className="border-t pt-5">
                  <h4 className="font-black text-[#174c32] mb-3">
                    إدارة XCoin
                  </h4>

                  <div className="flex gap-2">
                    <input
                      type="number"
                      min="1"
                      value={xcoinAmount}
                      onChange={(e) =>
                        setXcoinAmount(e.target.value)
                      }
                      placeholder="الكمية"
                      className="flex-1 border border-gray-200 rounded-xl px-4 py-3 outline-none focus:border-[#174c32]"
                    />

                    <button
                      disabled={saving}
                      onClick={() => updateXcoin("add")}
                      className="bg-green-600 text-white px-4 rounded-xl font-bold"
                    >
                      + إضافة
                    </button>

                    <button
                      disabled={saving}
                      onClick={() => updateXcoin("remove")}
                      className="bg-red-500 text-white px-4 rounded-xl font-bold"
                    >
                      - خصم
                    </button>
                  </div>
                </div>

                <div className="flex gap-2">
                  <button
                    onClick={() => setEditingUser(true)}
                    className="flex-1 bg-[#174c32] text-white py-3 rounded-xl font-bold"
                  >
                    تعديل البيانات
                  </button>

                  {selectedUser.role !== "ADMIN" && (
                    <button
                      disabled={saving}
                      onClick={() => deleteUser(selectedUser)}
                      className="bg-red-50 text-red-600 px-5 rounded-xl font-bold"
                    >
                      حذف
                    </button>
                  )}
                </div>
              </>
            )}
          </div>
        </Modal>
      )}

      {/* ================= ORDER MODAL ================= */}

      {showOrderModal && selectedOrder && (
        <Modal
          title={`تفاصيل الطلب #${selectedOrder.id}`}
          onClose={() => setShowOrderModal(false)}
        >
          <div className="space-y-5">
            <div className="grid sm:grid-cols-2 gap-3">
              <InfoBox
                label="العميل"
                value={selectedOrder.user?.name || "مستخدم"}
              />

              <InfoBox
                label="الهاتف"
                value={
                  selectedOrder.phone ||
                  selectedOrder.user?.phone ||
                  "-"
                }
              />

              <InfoBox
                label="البريد"
                value={selectedOrder.user?.email || "-"}
              />

              <InfoBox
                label="التاريخ"
                value={formatDate(selectedOrder.createdAt)}
              />

              <InfoBox
                label="العنوان"
                value={selectedOrder.address}
              />

              <InfoBox
                label="الحالة"
                value={statusLabels[selectedOrder.status]}
              />
            </div>

            <div>
              <h4 className="font-black text-[#174c32] mb-3">
                المنتجات
              </h4>

              <div className="space-y-2">
                {selectedOrder.items.map((item) => (
                  <div
                    key={item.id}
                    className="flex items-center justify-between gap-3 bg-[#f7f3e7] rounded-xl p-3"
                  >
                    <div>
                      <p className="font-bold">
                        {item.productName}
                      </p>

                      <p className="text-xs text-gray-500">
                        {item.quantity} ×{" "}
                        {formatPrice(item.price)}
                      </p>
                    </div>

                    <p className="font-black text-[#174c32]">
                      {formatPrice(item.price * item.quantity)}
                    </p>
                  </div>
                ))}
              </div>
            </div>

            <div className="bg-[#fff4d2] rounded-2xl p-4 space-y-2">
              <div className="flex justify-between">
                <span>المجموع الفرعي</span>
                <strong>
                  {formatPrice(selectedOrder.subtotal)}
                </strong>
              </div>

              <div className="flex justify-between">
                <span>الشحن</span>
                <strong>
                  {selectedOrder.shipping === 0
                    ? "مجاني"
                    : formatPrice(selectedOrder.shipping)}
                </strong>
              </div>

              <div className="border-t border-black/10 pt-2 flex justify-between text-lg">
                <span className="font-black">الإجمالي</span>
                <strong className="text-[#174c32]">
                  {formatPrice(selectedOrder.total)}
                </strong>
              </div>
            </div>

            <div>
              <label className="block font-bold mb-2">
                تغيير حالة الطلب
              </label>

              <select
                value={selectedOrder.status}
                onChange={(e) =>
                  updateOrderStatus(
                    selectedOrder,
                    e.target.value as OrderStatus,
                  )
                }
                className="w-full border border-gray-200 rounded-xl px-4 py-3 outline-none"
              >
                <option value="PENDING">
                  في انتظار التأكيد
                </option>

                <option value="CONFIRMED">
                  تم تأكيد الطلب
                </option>

                <option value="PROCESSING">
                  جاري التجهيز
                </option>

                <option value="SHIPPED">
                  تم الشحن
                </option>

                <option value="DELIVERED">
                  تم التسليم
                </option>

                <option value="CANCELLED">
                  تم الإلغاء
                </option>
              </select>
            </div>
          </div>
        </Modal>
      )}

      {/* ================= PRODUCT MODAL ================= */}

      {showProductModal && (
        <Modal
          title={
            editingProduct ? "تعديل المنتج" : "إضافة منتج جديد"
          }
          onClose={() => setShowProductModal(false)}
        >
          <div className="space-y-4">
            <Input
              label="اسم المنتج"
              value={productForm.name}
              onChange={(value) =>
                setProductForm((prev) => ({
                  ...prev,
                  name: value,
                }))
              }
            />

            <div>
              <label className="block font-bold text-sm mb-2">
                الوصف
              </label>

              <textarea
                value={productForm.description}
                onChange={(e) =>
                  setProductForm((prev) => ({
                    ...prev,
                    description: e.target.value,
                  }))
                }
                rows={3}
                className="w-full border border-gray-200 rounded-xl px-4 py-3 outline-none focus:border-[#174c32] resize-none"
              />
            </div>

            <div className="grid sm:grid-cols-2 gap-3">
              <Input
                label="السعر"
                type="number"
                value={productForm.price}
                onChange={(value) =>
                  setProductForm((prev) => ({
                    ...prev,
                    price: value,
                  }))
                }
              />

              <Input
                label="سعر XCoin"
                type="number"
                value={productForm.xcoinPrice}
                onChange={(value) =>
                  setProductForm((prev) => ({
                    ...prev,
                    xcoinPrice: value,
                  }))
                }
              />

              <Input
                label="المخزون"
                type="number"
                value={productForm.stock}
                onChange={(value) =>
                  setProductForm((prev) => ({
                    ...prev,
                    stock: value,
                  }))
                }
              />

             <div>
  <label className="block font-bold text-sm mb-2">
    صورة المنتج
  </label>

  <div className="rounded-2xl border-2 border-dashed border-gray-200 p-4">
    <input
      type="file"
      accept="image/*"
      onChange={handleImageUpload}
      disabled={uploadingImage}
      className="w-full cursor-pointer text-sm"
    />

    {uploadingImage && (
      <div className="mt-3 rounded-xl bg-[#f7f3e7] px-4 py-3 text-sm font-bold text-[#174c32]">
        جاري رفع الصورة...
      </div>
    )}

    {productForm.image && !uploadingImage && (
      <div className="mt-4 overflow-hidden rounded-2xl border border-gray-100 bg-[#f7f3e7]">
        <img
          src={productForm.image}
          alt="معاينة المنتج"
          className="h-48 w-full object-contain"
        />
      </div>
    )}
  </div>
</div>
            </div>

            <button
              disabled={saving}
              onClick={saveProduct}
              className="w-full bg-[#174c32] text-white py-3 rounded-xl font-bold hover:bg-[#103b27] transition disabled:opacity-50"
            >
              {saving
                ? "جاري الحفظ..."
                : editingProduct
                  ? "حفظ التعديلات"
                  : "إضافة المنتج"}
            </button>
          </div>
        </Modal>
      )}
    </main>
  );
}

/* ================= COMPONENTS ================= */

function StatCard({
  icon,
  title,
  value,
  onClick,
}: {
  icon: string;
  title: string;
  value: number;
  onClick: () => void;
}) {
  return (
    <button
      onClick={onClick}
      className="bg-white rounded-[28px] border border-gray-100 shadow-sm p-5 text-right hover:-translate-y-1 transition"
    >
      <div className="flex items-center justify-between">
        <div className="w-12 h-12 rounded-2xl bg-[#f7f3e7] flex items-center justify-center text-2xl">
          {icon}
        </div>

        <span className="text-gray-400">→</span>
      </div>

      <p className="text-gray-500 text-sm mt-4">
        {title}
      </p>

      <p className="text-3xl font-black text-[#174c32] mt-1">
        {value}
      </p>
    </button>
  );
}

function EmptyState({ text }: { text: string }) {
  return (
    <div className="p-10 text-center text-gray-500">
      <div className="text-4xl mb-3">📭</div>
      <p className="font-bold">{text}</p>
    </div>
  );
}

function Modal({
  title,
  onClose,
  children,
}: {
  title: string;
  onClose: () => void;
  children: React.ReactNode;
}) {
  return (
    <div className="fixed inset-0 z-50 bg-black/50 backdrop-blur-sm flex items-center justify-center p-4">
      <div className="bg-white w-full max-w-2xl max-h-[90vh] overflow-y-auto rounded-[28px] shadow-2xl">
        <div className="sticky top-0 bg-white border-b border-gray-100 p-5 flex items-center justify-between">
          <h2 className="text-xl font-black text-[#174c32]">
            {title}
          </h2>

          <button
            onClick={onClose}
            className="w-10 h-10 rounded-xl bg-gray-100 hover:bg-gray-200 font-black"
          >
            ✕
          </button>
        </div>

        <div className="p-5">{children}</div>
      </div>
    </div>
  );
}

function Input({
  label,
  value,
  onChange,
  type = "text",
}: {
  label: string;
  value: string;
  onChange: (value: string) => void;
  type?: string;
}) {
  return (
    <div>
      <label className="block font-bold text-sm mb-2">
        {label}
      </label>

      <input
        type={type}
        value={value}
        onChange={(e) => onChange(e.target.value)}
        className="w-full border border-gray-200 rounded-xl px-4 py-3 outline-none focus:border-[#174c32]"
      />
    </div>
  );
}

function InfoBox({
  label,
  value,
}: {
  label: string;
  value: string;
}) {
  return (
    <div className="bg-[#f7f3e7] rounded-xl p-3">
      <p className="text-xs text-gray-500 mb-1">{label}</p>
      <p className="font-bold break-words">{value}</p>
    </div>
  );
}

