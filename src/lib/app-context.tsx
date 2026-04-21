import { createContext, useContext, useEffect, useMemo, useState, type ReactNode } from "react";
import { translations, type Lang, type TKey } from "./i18n";
import {
  initialEmployees,
  initialLeaveRequests,
  initialMenu,
  initialOrders,
  type Employee,
  type LeaveRequest,
  type MenuItem,
  type Order,
  type Role,
} from "./mock-data";

interface CartItem {
  menuId: string;
  qty: number;
}

interface AttendanceRecord {
  checkedIn: boolean;
  checkInTime: string | null;
  checkOutTime: string | null;
}

interface AppContextValue {
  // i18n
  lang: Lang;
  setLang: (l: Lang) => void;
  t: (k: TKey) => string;
  dir: "ltr" | "rtl";
  // Auth & Role
  isAuthenticated: boolean;
  login: (username: string) => void;
  logout: () => void;
  role: Role;
  currentUser: Employee;
  // Attendance
  attendance: AttendanceRecord;
  toggleAttendance: () => void;
  // Menu / cart / orders
  menu: MenuItem[];
  cart: CartItem[];
  addToCart: (id: string) => void;
  removeFromCart: (id: string) => void;
  updateQty: (id: string, qty: number) => void;
  clearCart: () => void;
  cartTotal: number;
  cartCount: number;
  orders: Order[];
  placeOrder: () => Order;
  updateOrderStatus: (id: string, status: Order["status"]) => void;
  restockItem: (id: string, amount: number) => void;
  // Employees
  employees: Employee[];
  addEmployee: (e: Omit<Employee, "id" | "avatar" | "status">) => void;
  // Leave
  leaveRequests: LeaveRequest[];
  addLeaveRequest: (req: Omit<LeaveRequest, "id" | "status" | "employeeId" | "employeeName">) => void;
  leaveBalance: { annual: number; sick: number; casual: number };
}

const AppContext = createContext<AppContextValue | null>(null);

export function AppProvider({ children }: { children: ReactNode }) {
  const [lang, setLangState] = useState<Lang>("en");
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [role, setRole] = useState<Role>("employee");
  const [attendance, setAttendance] = useState<AttendanceRecord>({
    checkedIn: false,
    checkInTime: null,
    checkOutTime: null,
  });
  const [menu, setMenu] = useState<MenuItem[]>(initialMenu);
  const [cart, setCart] = useState<CartItem[]>([]);
  const [orders, setOrders] = useState<Order[]>(initialOrders);
  const [employees, setEmployees] = useState<Employee[]>(initialEmployees);
  const [leaveRequests, setLeaveRequests] = useState<LeaveRequest[]>(initialLeaveRequests);

  const dir = lang === "ar" ? "rtl" : "ltr";

  useEffect(() => {
    if (typeof document !== "undefined") {
      document.documentElement.dir = dir;
      document.documentElement.lang = lang;
    }
  }, [dir, lang]);

  const setLang = (l: Lang) => setLangState(l);
  const t = (k: TKey) => translations[lang][k] ?? k;

  const currentUser: Employee = useMemo(() => {
    if (role === "hr") return { ...employees[5], name: "Layla Ibrahim (HR)", nameAr: "ليلى إبراهيم (موارد بشرية)" };
    if (role === "manager") return { ...employees[0], name: "Ahmed Hassan (Manager)", nameAr: "أحمد حسن (مدير)" };
    if (role === "canteen") return {
      id: "C001", name: "Mahmoud (Canteen)", nameAr: "محمود (كافتيريا)",
      department: "Canteen", departmentAr: "كافتيريا", email: "canteen@smartoffice.io",
      desk: "GF-CAN", status: "present", avatar: "MC",
    };
    return employees[1];
  }, [role, employees]);

  const login = (username: string) => {
    const lower = username.toLowerCase();
    if (lower === "hr") setRole("hr");
    else if (lower === "manager") setRole("manager");
    else if (lower === "canteen") setRole("canteen");
    else setRole("employee");
    
    setIsAuthenticated(true);
  };

  const logout = () => {
    setIsAuthenticated(false);
  };

  const toggleAttendance = () => {
    const now = new Date().toISOString();
    setAttendance((prev) =>
      prev.checkedIn
        ? { ...prev, checkedIn: false, checkOutTime: now }
        : { checkedIn: true, checkInTime: now, checkOutTime: null }
    );
  };

  const addToCart = (id: string) => {
    setCart((prev) => {
      const existing = prev.find((c) => c.menuId === id);
      if (existing) return prev.map((c) => (c.menuId === id ? { ...c, qty: c.qty + 1 } : c));
      return [...prev, { menuId: id, qty: 1 }];
    });
  };

  const removeFromCart = (id: string) => setCart((prev) => prev.filter((c) => c.menuId !== id));
  const updateQty = (id: string, qty: number) => {
    if (qty <= 0) return removeFromCart(id);
    setCart((prev) => prev.map((c) => (c.menuId === id ? { ...c, qty } : c)));
  };
  const clearCart = () => setCart([]);

  const cartTotal = cart.reduce((sum, c) => {
    const m = menu.find((mi) => mi.id === c.menuId);
    return sum + (m ? m.price * c.qty : 0);
  }, 0);
  const cartCount = cart.reduce((s, c) => s + c.qty, 0);

  const placeOrder = (): Order => {
    const orderItems = cart.map((c) => {
      const m = menu.find((mi) => mi.id === c.menuId)!;
      return { menuId: m.id, name: m.name, nameAr: m.nameAr, qty: c.qty, price: m.price };
    });
    const newOrder: Order = {
      id: `ORD-${Math.floor(2400 + Math.random() * 600)}`,
      employeeName: currentUser.name,
      employeeNameAr: currentUser.nameAr,
      desk: currentUser.desk,
      floor: parseInt(currentUser.desk.match(/F(\d)/)?.[1] || "1"),
      zone: currentUser.desk.match(/-([A-Z])/)?.[1] || "A",
      items: orderItems,
      total: cartTotal,
      status: "pending",
      createdAt: new Date().toISOString(),
    };
    // decrement stock
    setMenu((prev) =>
      prev.map((m) => {
        const c = cart.find((ci) => ci.menuId === m.id);
        return c ? { ...m, stock: Math.max(0, m.stock - c.qty) } : m;
      })
    );
    setOrders((prev) => [newOrder, ...prev]);
    setCart([]);
    return newOrder;
  };

  const updateOrderStatus = (id: string, status: Order["status"]) => {
    setOrders((prev) => prev.map((o) => (o.id === id ? { ...o, status } : o)));
  };

  const restockItem = (id: string, amount: number) => {
    setMenu((prev) => prev.map((m) => (m.id === id ? { ...m, stock: m.stock + amount } : m)));
  };

  const addEmployee: AppContextValue["addEmployee"] = (e) => {
    const id = `E${String(employees.length + 1).padStart(3, "0")}`;
    const avatar = e.name.split(" ").map((s) => s[0]).slice(0, 2).join("").toUpperCase();
    setEmployees((prev) => [...prev, { ...e, id, avatar, status: "present" }]);
  };

  const addLeaveRequest: AppContextValue["addLeaveRequest"] = (req) => {
    const id = `L${String(leaveRequests.length + 1).padStart(3, "0")}`;
    setLeaveRequests((prev) => [
      ...prev,
      {
        ...req,
        id,
        status: "pending",
        employeeId: currentUser.id,
        employeeName: currentUser.name,
      },
    ]);
  };

  const leaveBalance = { annual: 18, sick: 10, casual: 5 };

  const value: AppContextValue = {
    lang, setLang, t, dir,
    isAuthenticated, login, logout,
    role, currentUser,
    attendance, toggleAttendance,
    menu, cart, addToCart, removeFromCart, updateQty, clearCart, cartTotal, cartCount,
    orders, placeOrder, updateOrderStatus, restockItem,
    employees, addEmployee,
    leaveRequests, addLeaveRequest, leaveBalance,
  };

  return <AppContext.Provider value={value}>{children}</AppContext.Provider>;
}

export function useApp() {
  const ctx = useContext(AppContext);
  if (!ctx) throw new Error("useApp must be used within AppProvider");
  return ctx;
}
